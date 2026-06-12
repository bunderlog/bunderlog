import { describe, expect, it, vi } from 'vitest'
import { handleStats } from '../src/routes/stats'

function makeDb(
  total = 0,
  levels: Array<{ level: string; n: number }> = [],
  services: Array<{ service: string; n: number }> = [],
) {
  const stmts: Record<string, object> = {
    'SELECT COUNT(*) AS n FROM logs': {
      first: vi.fn(async () => ({ n: total })),
    },
    'SELECT level, COUNT(*) AS n FROM logs GROUP BY level': {
      all: vi.fn(async () => ({ results: levels })),
    },
    'SELECT service, COUNT(*) AS n FROM logs GROUP BY service': {
      all: vi.fn(async () => ({ results: services })),
    },
  }
  return { prepare: vi.fn((sql: string) => stmts[sql] ?? {}) }
}

describe('GET /stats', () => {
  it('returns zeros when DB is empty', async () => {
    const res = await handleStats(makeDb() as never)
    const body = (await res.json()) as {
      total: number
      byLevel: Record<string, number>
      byService: Record<string, number>
    }
    expect(body.total).toBe(0)
    expect(body.byLevel['info']).toBe(0)
    expect(body.byLevel['error']).toBe(0)
    expect(Object.keys(body.byService)).toHaveLength(0)
  })

  it('returns total from DB', async () => {
    const res = await handleStats(makeDb(42) as never)
    const body = (await res.json()) as { total: number }
    expect(body.total).toBe(42)
  })

  it('returns byLevel counts from DB', async () => {
    const res = await handleStats(
      makeDb(5, [
        { level: 'info', n: 3 },
        { level: 'error', n: 2 },
      ]) as never,
    )
    const body = (await res.json()) as { byLevel: Record<string, number> }
    expect(body.byLevel['info']).toBe(3)
    expect(body.byLevel['error']).toBe(2)
    expect(body.byLevel['debug']).toBe(0)
  })

  it('returns byService counts from DB', async () => {
    const res = await handleStats(
      makeDb(
        10,
        [],
        [
          { service: 'api', n: 6 },
          { service: 'payments', n: 4 },
        ],
      ) as never,
    )
    const body = (await res.json()) as { byService: Record<string, number> }
    expect(body.byService['api']).toBe(6)
    expect(body.byService['payments']).toBe(4)
  })

  it('handles null total gracefully', async () => {
    const stmts: Record<string, object> = {
      'SELECT COUNT(*) AS n FROM logs': { first: vi.fn(async () => null) },
      'SELECT level, COUNT(*) AS n FROM logs GROUP BY level': {
        all: vi.fn(async () => ({ results: [] })),
      },
      'SELECT service, COUNT(*) AS n FROM logs GROUP BY service': {
        all: vi.fn(async () => ({ results: [] })),
      },
    }
    const db = { prepare: vi.fn((sql: string) => stmts[sql] ?? {}) }
    const res = await handleStats(db as never)
    const body = (await res.json()) as { total: number }
    expect(body.total).toBe(0)
  })

  it('returns all five log levels in byLevel', async () => {
    const res = await handleStats(makeDb() as never)
    const body = (await res.json()) as { byLevel: Record<string, number> }
    expect(Object.keys(body.byLevel)).toEqual(['debug', 'info', 'warn', 'error', 'fatal'])
  })
})
