import { describe, expect, it, vi } from 'vitest'
import worker from '../src/index'

const TEST_TOKEN = 'test-token-123'

const mockQueue = { sendBatch: vi.fn(async () => {}) }

const testEnv = {
  LOG_TOKEN: TEST_TOKEN,
  QUEUE: mockQueue,
}

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
    const res = await worker.fetch(makeRequest('GET', '/ingest'), testEnv as never, {} as never)
    expect(res.status).toBe(405)
  })

  it('returns 404 for unknown path', async () => {
    const res = await worker.fetch(makeRequest('POST', '/unknown'), testEnv as never, {} as never)
    expect(res.status).toBe(404)
  })

  it('returns 401 when token is missing', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/ingest', { logs: [] }),
      testEnv as never,
      {} as never,
    )
    expect(res.status).toBe(401)
  })

  it('returns 401 when token is wrong', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/ingest', { logs: [] }, { 'X-Log-Token': 'wrong' }),
      testEnv as never,
      {} as never,
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
      {} as never,
    )
    expect(res.status).toBe(400)
    const body = (await res.json()) as { code: string }
    expect(body.code).toBe('INVALID_JSON')
  })

  it('returns 400 for validation errors', async () => {
    const res = await worker.fetch(
      makeRequest('POST', '/ingest', { logs: [] }, { 'X-Log-Token': TEST_TOKEN }),
      testEnv as never,
      {} as never,
    )
    expect(res.status).toBe(400)
    const body = (await res.json()) as { code: string }
    expect(body.code).toBe('VALIDATION_ERROR')
  })

  it('returns 202 with accepted count and calls sendBatch', async () => {
    mockQueue.sendBatch.mockClear()
    const res = await worker.fetch(
      makeRequest(
        'POST',
        '/ingest',
        { logs: [{ level: 'info', service: 'api', message: 'hello' }] },
        { 'X-Log-Token': TEST_TOKEN },
      ),
      testEnv as never,
      {} as never,
    )
    expect(res.status).toBe(202)
    const body = (await res.json()) as { accepted: number }
    expect(body.accepted).toBe(1)
    expect(mockQueue.sendBatch).toHaveBeenCalledOnce()
  })

  it('attaches geo fields from request.cf', async () => {
    mockQueue.sendBatch.mockClear()
    const req = Object.assign(
      makeRequest(
        'POST',
        '/ingest',
        { logs: [{ level: 'warn', service: 'svc', message: 'msg' }] },
        { 'X-Log-Token': TEST_TOKEN, 'cf-ray': '123abc' },
      ),
      { cf: { connectingIp: '1.2.3.4', country: 'US' } },
    )
    await worker.fetch(req as never, testEnv as never, {} as never)
    const [[messages]] = mockQueue.sendBatch.mock.calls as [
      Array<Array<{ body: Record<string, unknown> }>>,
    ]
    expect(messages[0]?.body).toMatchObject({ ip: '1.2.3.4', country: 'US', ray: '123abc' })
  })
})
