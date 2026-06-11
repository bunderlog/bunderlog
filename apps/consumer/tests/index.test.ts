import { describe, expect, it, vi } from 'vitest'
import type { QueueMessage } from '@bunderlog/types'
import worker from '../src/index'

function makeMsg(overrides: Partial<QueueMessage> = {}): { body: QueueMessage } {
  return {
    body: {
      ts: Date.now(),
      level: 'info',
      service: 'api',
      message: 'test',
      ip: null,
      country: null,
      ray: null,
      ...overrides,
    },
  }
}

function makeEnv() {
  const store: Record<string, string> = {}
  return {
    DB: {
      prepare: vi.fn(() => ({ bind: vi.fn(() => ({ run: vi.fn() })) })),
      batch: vi.fn(async () => []),
    },
    ARCHIVE: { put: vi.fn(async () => {}) },
    COUNTERS: {
      get: vi.fn(async (k: string) => store[k] ?? null),
      put: vi.fn(async (k: string, v: string) => {
        store[k] = v
      }),
    },
  }
}

describe('queue handler', () => {
  it('calls insertBatch, archiveBatch, and incrementCounters', async () => {
    const env = makeEnv()
    const ackAll = vi.fn()
    const batch = { messages: [makeMsg(), makeMsg({ level: 'error' })], ackAll }

    await worker.queue(batch as never, env as never)

    expect(env.DB.batch).toHaveBeenCalledOnce()
    expect(env.ARCHIVE.put).toHaveBeenCalledOnce()
    expect(env.COUNTERS.put).toHaveBeenCalled()
    expect(ackAll).toHaveBeenCalledOnce()
  })

  it('acks the batch even if all entries process correctly', async () => {
    const env = makeEnv()
    const ackAll = vi.fn()
    await worker.queue({ messages: [makeMsg()], ackAll } as never, env as never)
    expect(ackAll).toHaveBeenCalledOnce()
  })

  it('passes geo fields from message into the R2 archive', async () => {
    const env = makeEnv()
    const ackAll = vi.fn()
    await worker.queue(
      { messages: [makeMsg({ ip: '5.6.7.8', country: 'DE', ray: 'ray1' })], ackAll } as never,
      env as never,
    )
    const [, ndjson] = env.ARCHIVE.put.mock.calls[0] as [string, string]
    const archived = JSON.parse(ndjson) as { ip: string; country: string; ray: string }
    expect(archived.ip).toBe('5.6.7.8')
    expect(archived.country).toBe('DE')
    expect(archived.ray).toBe('ray1')
  })
})
