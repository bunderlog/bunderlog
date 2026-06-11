import { describe, expect, it, vi } from 'vitest'
import type { LogEntry } from '@bunderlog/types'
import { archiveBatch } from '../src/r2'

const entry: LogEntry = {
  id: 'abc',
  ts: 1000,
  level: 'info',
  service: 'api',
  message: 'hello',
  meta: null,
  ip: null,
  country: null,
  ray: null,
  ingest_ts: 2000,
}

describe('archiveBatch', () => {
  it('does nothing for an empty batch', async () => {
    const bucket = { put: vi.fn() } as never
    await archiveBatch(bucket, [])
    expect(bucket.put).not.toHaveBeenCalled()
  })

  it('writes NDJSON to a timestamped path inside the hour directory', async () => {
    const bucket = { put: vi.fn(async () => {}) } as never
    await archiveBatch(bucket, [entry])

    expect(bucket.put).toHaveBeenCalledOnce()
    const [path, body] = bucket.put.mock.calls[0] as [string, string]

    expect(path).toMatch(/^\d{4}\/\d{2}\/\d{2}\/\d{2}\/\d+-[\w-]+\.ndjson$/)
    expect(body).toBe(JSON.stringify(entry))
  })

  it('writes multiple entries as newline-separated JSON', async () => {
    const bucket = { put: vi.fn(async () => {}) } as never
    const second = { ...entry, id: 'def', level: 'warn' } as LogEntry
    await archiveBatch(bucket, [entry, second])

    const [, body] = bucket.put.mock.calls[0] as [string, string]
    const lines = body.split('\n')
    expect(lines).toHaveLength(2)
    expect(JSON.parse(lines[0]!)).toMatchObject({ id: 'abc' })
    expect(JSON.parse(lines[1]!)).toMatchObject({ id: 'def' })
  })

  it('sets content-type to application/x-ndjson', async () => {
    const bucket = { put: vi.fn(async () => {}) } as never
    await archiveBatch(bucket, [entry])
    const [, , opts] = bucket.put.mock.calls[0] as [
      string,
      string,
      { httpMetadata: { contentType: string } },
    ]
    expect(opts.httpMetadata.contentType).toBe('application/x-ndjson')
  })
})
