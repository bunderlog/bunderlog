import { describe, expect, it, vi } from 'vitest'
import type { LogEntry } from '@bunderlog/types'
import { incrementCounters } from '../src/kv'

function makeEntry(level: LogEntry['level'], service: string): LogEntry {
  return {
    id: crypto.randomUUID(),
    ts: 1000,
    ingest_ts: 2000,
    level,
    service,
    message: 'msg',
    meta: null,
    ip: null,
    country: null,
    ray: null,
  }
}

function makeKv(store: Record<string, string> = {}) {
  return {
    get: vi.fn(async (key: string) => store[key] ?? null),
    put: vi.fn(async (key: string, value: string) => {
      store[key] = value
    }),
  }
}

describe('incrementCounters', () => {
  it('does nothing for an empty batch', async () => {
    const kv = makeKv()
    await incrementCounters(kv as never, [])
    expect(kv.put).not.toHaveBeenCalled()
  })

  it('increments count:total by batch size', async () => {
    const store: Record<string, string> = {}
    const kv = makeKv(store)
    await incrementCounters(kv as never, [makeEntry('info', 'api'), makeEntry('warn', 'api')])
    expect(store['count:total']).toBe('2')
  })

  it('accumulates on top of existing total', async () => {
    const store: Record<string, string> = { 'count:total': '10' }
    const kv = makeKv(store)
    await incrementCounters(kv as never, [makeEntry('info', 'api')])
    expect(store['count:total']).toBe('11')
  })

  it('increments per-level counter', async () => {
    const store: Record<string, string> = {}
    const kv = makeKv(store)
    await incrementCounters(kv as never, [
      makeEntry('error', 'api'),
      makeEntry('error', 'worker'),
      makeEntry('info', 'api'),
    ])
    expect(store['count:level:error']).toBe('2')
    expect(store['count:level:info']).toBe('1')
  })

  it('increments per-service counter', async () => {
    const store: Record<string, string> = {}
    const kv = makeKv(store)
    await incrementCounters(kv as never, [
      makeEntry('info', 'api'),
      makeEntry('warn', 'api'),
      makeEntry('info', 'payments'),
    ])
    expect(store['count:service:api']).toBe('2')
    expect(store['count:service:payments']).toBe('1')
  })
})
