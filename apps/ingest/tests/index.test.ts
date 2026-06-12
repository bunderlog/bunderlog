import { describe, expect, it, vi } from 'vitest'
import { toLogEntry, insertBatch } from '../src/db'
import worker from '../src/index'

vi.mock('../src/db', () => ({
  toLogEntry: vi.fn((msg) => ({ ...msg, id: 'mock-id', ingest_ts: 0, meta: null })),
  insertBatch: vi.fn(async () => {}),
}))

const TEST_TOKEN = 'test-token-123'

const testEnv = {
  LOG_TOKEN: TEST_TOKEN,
  DB: {} as never,
}

const testCtx = { waitUntil: vi.fn() }

function makeRequest(
  method: string,
  path: string,
  body?: unknown,
  headers: Record<string, string> = {},
): Request {
  return new Request(`https://ingest.example.com${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

describe('POST /ingest', () => {
  it('returns 405 for non-POST requests', async () => {
    const res = await worker.fetch(
      makeRequest('GET', '/ingest'),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(405)
  })

  it('returns 404 for unknown path', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/unknown'),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(404)
  })

  it('returns 401 when token is missing', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/ingest', { logs: [] }),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(401)
  })

  it('returns 401 when token is wrong', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/ingest', { logs: [] }, { 'X-Log-Token': 'wrong' }),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(401)
  })

  it('returns 400 for invalid JSON', async () => {
    const res = await worker.fetch(
      new Request('https://ingest.example.com/ingest', {
        method: 'POST',
        headers: { 'X-Log-Token': TEST_TOKEN, 'Content-Type': 'application/json' },
        body: 'not-json',
      }),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(400)
    const body = (await res.json()) as { code: string }
    expect(body.code).toBe('INVALID_JSON')
  })

  it('returns 400 for validation errors', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/ingest', { logs: [] }, { 'X-Log-Token': TEST_TOKEN }),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(400)
    const body = (await res.json()) as { code: string }
    expect(body.code).toBe('VALIDATION_ERROR')
  })

  it('returns 202 with accepted count and schedules storage via ctx.waitUntil', async () => {
    testCtx.waitUntil.mockClear()
    const res = await worker.fetch(
      makeRequest(
        'POST',
        '/ingest',
        { logs: [{ level: 'info', service: 'api', message: 'hello' }] },
        { 'X-Log-Token': TEST_TOKEN },
      ),
      testEnv as never,
      testCtx as never,
    )
    expect(res.status).toBe(202)
    const body = (await res.json()) as { accepted: number }
    expect(body.accepted).toBe(1)
    expect(testCtx.waitUntil).toHaveBeenCalledOnce()
  })

  it('attaches geo fields from request.cf', async () => {
    vi.mocked(toLogEntry).mockClear()
    const req = Object.assign(
      makeRequest(
        'POST',
        '/ingest',
        { logs: [{ level: 'warn', service: 'svc', message: 'msg' }] },
        { 'X-Log-Token': TEST_TOKEN, 'cf-ray': '123abc' },
      ),
      { cf: { connectingIp: '1.2.3.4', country: 'US' } },
    )
    await worker.fetch(req as never, testEnv as never, testCtx as never)
    const [[msg]] = vi.mocked(toLogEntry).mock.calls as [[Record<string, unknown>]]
    expect(msg).toMatchObject({ ip: '1.2.3.4', country: 'US', ray: '123abc' })
  })

  it('calls insertBatch with mapped entries', async () => {
    vi.mocked(insertBatch).mockClear()
    testCtx.waitUntil.mockClear()
    await worker.fetch(
      makeRequest(
        'POST',
        '/ingest',
        { logs: [{ level: 'error', service: 'worker', message: 'boom' }] },
        { 'X-Log-Token': TEST_TOKEN },
      ),
      testEnv as never,
      testCtx as never,
    )
    const [promise] = testCtx.waitUntil.mock.calls[0] as [Promise<unknown>]
    await promise
    expect(insertBatch).toHaveBeenCalledOnce()
  })
})
