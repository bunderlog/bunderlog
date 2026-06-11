import type { LogEntry } from '@bunderlog/types'

export async function handleLog(id: string, db: D1Database): Promise<Response> {
  const entry = await db.prepare('SELECT * FROM logs WHERE id = ?').bind(id).first<LogEntry>()

  if (!entry) {
    return Response.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
  }

  return Response.json(entry)
}
