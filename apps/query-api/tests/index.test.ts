import { describe, expect, it, vi } from 'vitest'
import worker from '../src/index'

function makeEnv() {
  const stmt = {
    bind: vi.fn(),
    all: vi.fn(async () => ({ results: [] })),
    first: vi.fn(async () => null),
  }
  stmt.bind.mockReturnValue(stmt)
  return {
    DB: { prepare: vi.fn(() => stmt) },
    COUNTERS: {
      get: vi.fn(async () => null),
      list: vi.fn(async () => ({ keys: [], list_complete: true })),
    },
    WEB_ORIGIN: 'https://bunderlog.dev',
  }
}

function req(method: string, path: string) {
  return new Request(`https://api.example.com${path}`, { method })
}

describe('worker routing', () => {
  it('returns 405 for non-GET methods', async () => {
    const res = await worker.fetch(req('POST', '/logs'), makeEnv() as never)
    expect(res.status).toBe(405)
  })

  it('handles OPTIONS preflight', async () => {
    const res = await worker.fetch(req('OPTIONS', '/logs'), makeEnv() as never)
    expect(res.status).toBe(204)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://bunderlog.dev')
  })

  it('returns 404 for unknown path', async () => {
    const res = await worker.fetch(req('GET', '/unknown'), makeEnv() as never)
    expect(res.status).toBe(404)
  })

  it('routes GET /logs', async () => {
    const res = await worker.fetch(req('GET', '/logs'), makeEnv() as never)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { logs: unknown[] }
    expect(Array.isArray(body.logs)).toBe(true)
  })

  it('routes GET /stats', async () => {
    const res = await worker.fetch(req('GET', '/stats'), makeEnv() as never)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { total: number }
    expect(typeof body.total).toBe('number')
  })

  it('routes GET /logs/:id and returns 404 for missing entry', async () => {
    const res = await worker.fetch(req('GET', '/logs/some-id'), makeEnv() as never)
    expect(res.status).toBe(404)
  })

  it('sets CORS headers on all responses', async () => {
    const res = await worker.fetch(req('GET', '/logs'), makeEnv() as never)
    expect(res.headers.get('Access-Control-Allow-Origin')).toBe('https://bunderlog.dev')
  })
})
