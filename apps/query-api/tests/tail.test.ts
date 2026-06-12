import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { LogEntry } from '@bunderlog/types'
import { handleTail } from '../src/routes/tail'

const entry: LogEntry = {
  id: 'id-1',
  ts: 1000,
  level: 'info',
  service: 'svc',
  message: 'msg',
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

function req(params: Record<string, string> = {}, headers: Record<string, string> = {}) {
  const url = new URL('https://api.example.com/tail')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new Request(url, { headers: new Headers(headers) })
}

function mockDeadlineExceeded() {
  vi.spyOn(Date, 'now')
    .mockReturnValueOnce(1000)
    .mockReturnValue(1000 + 25_001)
}

describe('GET /tail', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns SSE headers', () => {
    mockDeadlineExceeded()
    const res = handleTail(req(), makeDb() as never)
    expect(res.headers.get('Content-Type')).toBe('text/event-stream')
    expect(res.headers.get('Cache-Control')).toBe('no-cache')
  })

  it('streams log entries as SSE events', async () => {
    mockDeadlineExceeded()
    const res = handleTail(req(), makeDb([entry]) as never)
    const text = await res.text()
    expect(text).toContain('event: log')
    expect(text).toContain('"id":"id-1"')
  })

  it('sends empty stream when no results', async () => {
    mockDeadlineExceeded()
    const res = handleTail(req(), makeDb() as never)
    const text = await res.text()
    expect(text).toBe('')
  })

  it('reverses initial results so oldest appears first', async () => {
    mockDeadlineExceeded()
    const entries = [
      { ...entry, id: 'newer', ingest_ts: 3000 },
      { ...entry, id: 'older', ingest_ts: 1000 },
    ]
    const res = handleTail(req(), makeDb(entries) as never)
    const text = await res.text()
    expect(text.indexOf('"id":"older"')).toBeLessThan(text.indexOf('"id":"newer"'))
  })

  it('uses after query param to filter by ingest_ts', async () => {
    mockDeadlineExceeded()
    const db = makeDb([])
    await handleTail(req({ after: '5000' }), db as never).text()
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('WHERE ingest_ts > ?')
    expect(db._stmt.bind.mock.calls[0]).toContain('5000')
  })

  it('uses Last-Event-ID header to filter by ingest_ts', async () => {
    mockDeadlineExceeded()
    const db = makeDb([])
    await handleTail(req({}, { 'Last-Event-ID': '9000' }), db as never).text()
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('WHERE ingest_ts > ?')
    expect(db._stmt.bind.mock.calls[0]).toContain('9000')
  })

  it('executes a second poll when within deadline window', async () => {
    vi.useFakeTimers()
    // Date.now() call sequence:
    //   1st → deadline = 0 + 25_000 = 25_000
    //   2nd (while check) → 0 < 25_000 = true → enter loop
    //   3rd+ → 25_001 → past deadline, exit loop
    vi.spyOn(Date, 'now').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValue(25_001)

    const db = makeDb([])
    const textPromise = handleTail(req(), db as never).text()
    await vi.runAllTimersAsync()
    await textPromise

    vi.useRealTimers()
    vi.restoreAllMocks()

    expect(db.prepare.mock.calls).toHaveLength(2)
  })

  it('uses DESC LIMIT query when no cursor is provided', async () => {
    mockDeadlineExceeded()
    const db = makeDb([])
    await handleTail(req(), db as never).text()
    const sql = (db.prepare.mock.calls[0] as [string])[0]
    expect(sql).toContain('ORDER BY ingest_ts DESC LIMIT 50')
  })
})
