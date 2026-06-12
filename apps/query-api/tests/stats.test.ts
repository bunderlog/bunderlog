import { describe, expect, it, vi } from 'vitest'
import { handleStats } from '../src/routes/stats'

function makeKv(store: Record<string, string> = {}) {
  return {
    get: vi.fn(async (key: string) => store[key] ?? null),
    list: vi.fn(async ({ prefix }: { prefix: string }) => ({
      keys: Object.keys(store)
        .filter((k) => k.startsWith(prefix))
        .map((name) => ({ name })),
      list_complete: true,
    })),
  }
}

function makeDb(count = 0) {
  const stmt = {
    bind: vi.fn(),
    first: vi.fn(async () => ({ n: count })),
    all: vi.fn(async () => ({ results: [] })),
  }
  stmt.bind.mockReturnValue(stmt)
  return { prepare: vi.fn(() => stmt) }
}

describe('GET /stats', () => {
  it('returns zeros when KV is empty and DB has no rows', async () => {
    const res = await handleStats(makeDb() as never, makeKv() as never)
    const body = (await res.json()) as { total: number }
    expect(body.total).toBe(0)
  })

  it('reads total from KV when available', async () => {
    const kv = makeKv({ 'count:total': '42' })
    const res = await handleStats(makeDb() as never, kv as never)
    const body = (await res.json()) as { total: number }
    expect(body.total).toBe(42)
  })

  it('falls back to D1 COUNT for total when KV misses', async () => {
    const db = makeDb(7)
    const res = await handleStats(db as never, makeKv() as never)
    const body = (await res.json()) as { total: number }
    expect(body.total).toBe(7)
  })

  it('returns byLevel counts from KV', async () => {
    const kv = makeKv({
      'count:total': '5',
      'count:level:info': '3',
      'count:level:error': '2',
    })
    const res = await handleStats(makeDb() as never, kv as never)
    const body = (await res.json()) as { byLevel: Record<string, number> }
    expect(body.byLevel['info']).toBe(3)
    expect(body.byLevel['error']).toBe(2)
    expect(body.byLevel['debug']).toBe(0)
  })

  it('defaults byService count to 0 when KV get returns null for a listed key', async () => {
    const kv = {
      get: vi.fn(async () => null),
      list: vi.fn(async ({ prefix }: { prefix: string }) => ({
        keys: prefix.includes('service') ? [{ name: 'count:service:orphan' }] : [],
        list_complete: true,
      })),
    }
    const res = await handleStats(makeDb() as never, kv as never)
    const body = (await res.json()) as { byService: Record<string, number> }
    expect(body.byService['orphan']).toBe(0)
  })

  it('includes byService from KV list', async () => {
    const kv = makeKv({
      'count:total': '10',
      'count:service:api': '6',
      'count:service:payments': '4',
    })
    const res = await handleStats(makeDb() as never, kv as never)
    const body = (await res.json()) as { byService: Record<string, number> }
    expect(body.byService['api']).toBe(6)
    expect(body.byService['payments']).toBe(4)
  })
})
