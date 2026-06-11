import { describe, expect, it, vi } from 'vitest'
import type { LogEntry } from '@bunderlog/types'
import { handleLog } from '../src/routes/log'

const entry: LogEntry = {
  id: 'abc-123',
  ts: 1000,
  level: 'warn',
  service: 'api',
  message: 'test',
  meta: null,
  ip: null,
  country: null,
  ray: null,
  ingest_ts: 2000,
}

function makeDb(result: LogEntry | null) {
  const stmt = { bind: vi.fn(), first: vi.fn(async () => result) }
  stmt.bind.mockReturnValue(stmt)
  return { prepare: vi.fn(() => stmt) }
}

describe('GET /logs/:id', () => {
  it('returns the entry when found', async () => {
    const db = makeDb(entry)
    const res = await handleLog('abc-123', db as never)
    expect(res.status).toBe(200)
    const body = (await res.json()) as LogEntry
    expect(body.id).toBe('abc-123')
  })

  it('returns 404 when not found', async () => {
    const db = makeDb(null)
    const res = await handleLog('missing', db as never)
    expect(res.status).toBe(404)
    const body = (await res.json()) as { code: string }
    expect(body.code).toBe('NOT_FOUND')
  })
})
