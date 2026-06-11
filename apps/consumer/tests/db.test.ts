import { describe, expect, it, vi } from 'vitest'
import type { QueueMessage } from '@bunderlog/types'
import { insertBatch, toLogEntry } from '../src/db'

const baseMsg: QueueMessage = {
  ts: 1000,
  level: 'info',
  service: 'api',
  message: 'hello',
  ip: '1.2.3.4',
  country: 'US',
  ray: 'abc123',
}

describe('toLogEntry', () => {
  it('maps all fields from QueueMessage', () => {
    const entry = toLogEntry(baseMsg)
    expect(entry.ts).toBe(1000)
    expect(entry.level).toBe('info')
    expect(entry.service).toBe('api')
    expect(entry.message).toBe('hello')
    expect(entry.ip).toBe('1.2.3.4')
    expect(entry.country).toBe('US')
    expect(entry.ray).toBe('abc123')
    expect(entry.meta).toBeNull()
    expect(typeof entry.id).toBe('string')
    expect(entry.id).toHaveLength(36)
    expect(typeof entry.ingest_ts).toBe('number')
  })

  it('serializes meta to JSON string', () => {
    const entry = toLogEntry({ ...baseMsg, meta: { key: 'val', n: 42 } })
    expect(entry.meta).toBe('{"key":"val","n":42}')
  })

  it('sets meta to null when absent', () => {
    const entry = toLogEntry({ ...baseMsg, meta: undefined })
    expect(entry.meta).toBeNull()
  })

  it('generates unique ids per call', () => {
    const a = toLogEntry(baseMsg)
    const b = toLogEntry(baseMsg)
    expect(a.id).not.toBe(b.id)
  })
})

describe('insertBatch', () => {
  it('calls db.batch with one statement per entry', async () => {
    const bound = { run: vi.fn() }
    const prepared = { bind: vi.fn(() => bound) }
    const db = { prepare: vi.fn(() => prepared), batch: vi.fn(async () => []) } as never

    const entries = [toLogEntry(baseMsg), toLogEntry({ ...baseMsg, level: 'warn' })]
    await insertBatch(db, entries)

    expect(db.prepare).toHaveBeenCalledTimes(2)
    expect(db.batch).toHaveBeenCalledWith([bound, bound])
  })

  it('does nothing when entries is empty', async () => {
    const db = { prepare: vi.fn(), batch: vi.fn(async () => []) } as never
    await insertBatch(db, [])
    expect(db.batch).toHaveBeenCalledWith([])
  })
})
