import { describe, expect, it, vi } from 'vitest'
import type { LogEntry } from '@bunderlog/types'
import { handleLogs } from '../src/routes/logs'
import { encodeCursor } from '../src/cursor'

const entry: LogEntry = {
  id: 'id-1',
  ts: 1000,
  level: 'info',
  service: 'api',
  message: 'hello',
  meta: null,
  ip: null,
  country: null,
  ray: null,
  ingest_ts: 2000,
}

function makeDb(results: LogEntry[] = []) {
  const stmt = { bind: vi.fn(), all: vi.fn(async () => ({ results })) }
  stmt.bind.mockReturnValue(stmt)
  return { prepare: vi.fn(() => stmt), _stmt: stmt }
}

function req(params: Record<string, string> = {}) {
  const url = new URL('https://api.example.com/logs')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new Request(url)
}

describe('GET /logs', () => {
  it('returns empty logs and null cursor when no results', async () => {
    const { db } = { db: makeDb() }
    const res = await handleLogs(req(), db as never)
    const body = (await res.json()) as { logs: LogEntry[]; cursor: null }
    expect(body.logs).toEqual([])
    expect(body.cursor).toBeNull()
  })

  it('returns logs without next cursor when results fit in one page', async () => {
    const db = makeDb([entry])
    const res = await handleLogs(req({ limit: '10' }), db as never)
    const body = (await res.json()) as { logs: LogEntry[]; cursor: string | null }
    expect(body.logs).toHaveLength(1)
    expect(body.cursor).toBeNull()
  })

  it('returns next cursor when there are more results', async () => {
    // limit=1, we return 2 rows → hasMore=true, cursor is set
    const entries = [entry, { ...entry, id: 'id-2', ts: 900 }]
    const db = makeDb(entries)
    const res = await handleLogs(req({ limit: '1' }), db as never)
    const body = (await res.json()) as { logs: LogEntry[]; cursor: string | null }
    expect(body.logs).toHaveLength(1)
    expect(body.cursor).not.toBeNull()
  })

  it('passes cursor condition into query when cursor param supplied', async () => {
    const db = makeDb([])
    const cursor = encodeCursor(999, 'some-id')
    await handleLogs(req({ cursor }), db as never)
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('(ts < ? OR (ts = ? AND id < ?))')
  })

  it('applies service filter', async () => {
    const db = makeDb([])
    await handleLogs(req({ service: 'payments' }), db as never)
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('service = ?')
  })

  it('applies level filter', async () => {
    const db = makeDb([])
    await handleLogs(req({ level: 'error' }), db as never)
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('level = ?')
  })

  it('ignores invalid level values', async () => {
    const db = makeDb([])
    await handleLogs(req({ level: 'verbose' }), db as never)
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).not.toContain('level = ?')
  })

  it('applies full-text search with LIKE', async () => {
    const db = makeDb([])
    await handleLogs(req({ q: 'timeout' }), db as never)
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('message LIKE ?')
  })

  it('caps limit at 200', async () => {
    const db = makeDb([])
    await handleLogs(req({ limit: '9999' }), db as never)
    // bind receives limit+1 as the last arg — should be 201 (200+1)
    const bindArgs = db._stmt.bind.mock.calls[0] as number[]
    expect(bindArgs.at(-1)).toBe(201)
  })
})
