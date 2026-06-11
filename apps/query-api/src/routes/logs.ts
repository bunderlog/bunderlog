import type { LogEntry, LogsQueryParams, LogsResponse } from '@bunderlog/types'
import { isLogLevel } from '@bunderlog/types'
import { decodeCursor, encodeCursor } from '../cursor'

function parseParams(url: URL): LogsQueryParams {
  const params: LogsQueryParams = {}
  const service = url.searchParams.get('service')
  const level = url.searchParams.get('level')
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')
  const q = url.searchParams.get('q')
  const limit = url.searchParams.get('limit')

  if (service) params.service = service
  if (level && isLogLevel(level)) params.level = level
  if (from) params.from = parseInt(from, 10)
  if (to) params.to = parseInt(to, 10)
  if (q) params.q = q
  if (limit) params.limit = Math.min(parseInt(limit, 10), 200)
  params.cursor = url.searchParams.get('cursor') ?? undefined

  return params
}

export async function handleLogs(request: Request, db: D1Database): Promise<Response> {
  const url = new URL(request.url)
  const params = parseParams(url)
  const limit = params.limit ?? 50
  const cursor = params.cursor ? decodeCursor(params.cursor) : null

  const conditions: string[] = []
  const bindings: (string | number)[] = []

  if (params.service) {
    conditions.push('service = ?')
    bindings.push(params.service)
  }
  if (params.level) {
    conditions.push('level = ?')
    bindings.push(params.level)
  }
  if (params.from) {
    conditions.push('ts >= ?')
    bindings.push(params.from)
  }
  if (params.to) {
    conditions.push('ts <= ?')
    bindings.push(params.to)
  }
  if (params.q) {
    conditions.push('message LIKE ?')
    bindings.push(`%${params.q}%`)
  }
  if (cursor) {
    conditions.push('(ts < ? OR (ts = ? AND id < ?))')
    bindings.push(cursor.ts, cursor.ts, cursor.id)
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const sql = `SELECT * FROM logs ${where} ORDER BY ts DESC, id DESC LIMIT ?`
  bindings.push(limit + 1)

  const { results } = await db
    .prepare(sql)
    .bind(...bindings)
    .all<LogEntry>()

  const hasMore = results.length > limit
  const logs = hasMore ? results.slice(0, limit) : results
  const last = logs.at(-1)
  const nextCursor = hasMore && last ? encodeCursor(last.ts, last.id) : null

  return Response.json({ logs, cursor: nextCursor } satisfies LogsResponse)
}
