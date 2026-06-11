import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { logger } from '../src/index'

const ENDPOINT = 'https://api.example.com'
const TOKEN = 'test-token'
const SERVICE = 'test-svc'

function makeOk() {
  return vi.fn().mockResolvedValue(new Response('', { status: 202 }))
}

describe('logger — no-op when misconfigured', () => {
  it('returns no-op logger when endpoint is missing', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ token: TOKEN, service: SERVICE })
    log.info('hello')
    await log.flush()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('returns no-op logger when token is missing', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, service: SERVICE })
    log.debug('hello')
    log.info('hello')
    log.warn('hello')
    log.error('hello')
    log.fatal('hello')
    await log.flush()
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('logger — buffering and flushing', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('does not send when buffer is below batchSize', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 5 })
    log.info('one')
    log.info('two')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('flushes immediately when batchSize is reached', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 2 })
    log.info('a')
    log.info('b')
    await vi.runAllTimersAsync()
    expect(fetch).toHaveBeenCalledTimes(1)
    const body = JSON.parse((fetch.mock.calls[0] as [string, RequestInit])[1].body as string)
    expect(body.logs).toHaveLength(2)
  })

  it('flushes after flushMs when below batchSize', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, flushMs: 1000 })
    log.info('delayed')
    expect(fetch).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(999)
    expect(fetch).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('manual flush drains buffer and cancels timer', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, flushMs: 5000 })
    log.warn('manual')
    await log.flush()
    expect(fetch).toHaveBeenCalledTimes(1)
    // timer was cancelled — no second call after advancing time
    await vi.advanceTimersByTimeAsync(10000)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('flush is a no-op when buffer is empty', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE })
    await log.flush()
    expect(fetch).not.toHaveBeenCalled()
  })
})

describe('logger — payload shape', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('sends correct URL and headers', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 1 })
    log.error('boom')
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled())
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(`${ENDPOINT}/ingest`)
    expect((init.headers as Record<string, string>)['X-Log-Token']).toBe(TOKEN)
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json')
  })

  it('includes level, service, message, and ts in each record', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 1 })
    log.warn('test message', { key: 'val' })
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled())
    const body = JSON.parse((fetch.mock.calls[0] as [string, RequestInit])[1].body as string)
    const rec = body.logs[0]
    expect(rec.level).toBe('warn')
    expect(rec.service).toBe(SERVICE)
    expect(rec.message).toBe('test message')
    expect(rec.meta).toEqual({ key: 'val' })
    expect(typeof rec.ts).toBe('number')
  })

  it('omits meta field when not provided', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 1 })
    log.info('no meta')
    await vi.waitFor(() => expect(fetch).toHaveBeenCalled())
    const body = JSON.parse((fetch.mock.calls[0] as [string, RequestInit])[1].body as string)
    expect('meta' in body.logs[0]).toBe(false)
  })

  it('supports all five log levels', async () => {
    const fetch = makeOk()
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE })
    log.debug('d')
    log.info('i')
    log.warn('w')
    log.error('e')
    log.fatal('f')
    await log.flush()
    const body = JSON.parse((fetch.mock.calls[0] as [string, RequestInit])[1].body as string)
    expect(body.logs.map((r: { level: string }) => r.level)).toEqual([
      'debug',
      'info',
      'warn',
      'error',
      'fatal',
    ])
  })
})

describe('logger — retry logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('retries up to 3 times on 5xx responses', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response('', { status: 202 }))
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 99 })
    log.info('msg')
    const p = log.flush()
    await vi.runAllTimersAsync()
    await p
    expect(fetch).toHaveBeenCalledTimes(3)
  })

  it('does not retry on 4xx responses', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 401 }))
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 99 })
    log.info('msg')
    await log.flush()
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('retries on network error', async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error('network fail'))
      .mockResolvedValueOnce(new Response('', { status: 202 }))
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 99 })
    log.error('oops')
    const p = log.flush()
    await vi.runAllTimersAsync()
    await p
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('gives up after max attempts without throwing', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 500 }))
    vi.stubGlobal('fetch', fetch)
    const log = logger({ endpoint: ENDPOINT, token: TOKEN, service: SERVICE, batchSize: 99 })
    log.info('msg')
    const p = log.flush()
    await vi.runAllTimersAsync()
    await expect(p).resolves.toBeUndefined()
    expect(fetch).toHaveBeenCalledTimes(3)
  })
})
