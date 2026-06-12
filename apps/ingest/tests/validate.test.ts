import { describe, expect, it } from 'vitest'
import { validatePayload } from '../src/validate'

describe('validatePayload', () => {
  it('rejects non-object body', () => {
    expect(validatePayload('string')).toEqual({ error: 'Request body must be a JSON object' })
    expect(validatePayload(null)).toEqual({ error: 'Request body must be a JSON object' })
    expect(validatePayload([1, 2])).toEqual({ error: 'Request body must be a JSON object' })
  })

  it('rejects missing logs field', () => {
    const r = validatePayload({})
    expect(r).toEqual({ error: 'Field "logs" must be an array' })
  })

  it('rejects empty logs array', () => {
    const r = validatePayload({ logs: [] })
    expect(r).toEqual({ error: 'Field "logs" must not be empty' })
  })

  it('rejects batch exceeding 500 entries', () => {
    const logs = Array.from({ length: 501 }, () => ({
      ts: Date.now(),
      level: 'info',
      service: 'api',
      message: 'test',
    }))
    const r = validatePayload({ logs })
    expect(r).toEqual({ error: 'Field "logs" must not exceed 500 entries' })
  })

  it('accepts a valid single entry', () => {
    const r = validatePayload({
      logs: [{ ts: 1000, level: 'info', service: 'api', message: 'hello' }],
    })
    expect('payload' in r).toBe(true)
    if ('payload' in r) {
      expect(r.payload.logs).toHaveLength(1)
      expect(r.payload.logs[0]).toMatchObject({
        ts: 1000,
        level: 'info',
        service: 'api',
        message: 'hello',
      })
    }
  })

  it('defaults ts to now when missing', () => {
    const before = Date.now()
    const r = validatePayload({ logs: [{ level: 'debug', service: 'svc', message: 'msg' }] })
    const after = Date.now()
    expect('payload' in r).toBe(true)
    if ('payload' in r) {
      const ts = r.payload.logs[0]?.ts ?? 0
      expect(ts).toBeGreaterThanOrEqual(before)
      expect(ts).toBeLessThanOrEqual(after)
    }
  })

  it('rejects invalid level', () => {
    const r = validatePayload({ logs: [{ level: 'verbose', service: 'api', message: 'x' }] })
    expect('error' in r).toBe(true)
  })

  it('rejects missing service', () => {
    const r = validatePayload({ logs: [{ level: 'info', message: 'x' }] })
    expect('error' in r).toBe(true)
  })

  it('rejects service longer than 64 characters', () => {
    const r = validatePayload({
      logs: [{ level: 'info', service: 'a'.repeat(65), message: 'x' }],
    })
    expect('error' in r).toBe(true)
  })

  it('rejects non-object entry in logs array', () => {
    const r = validatePayload({ logs: ['a string', null, 42] })
    expect('error' in r).toBe(true)
  })

  it('rejects missing message', () => {
    const r = validatePayload({ logs: [{ level: 'info', service: 'api' }] })
    expect('error' in r).toBe(true)
  })

  it('rejects message longer than 4096 characters', () => {
    const r = validatePayload({
      logs: [{ level: 'info', service: 'api', message: 'x'.repeat(4097) }],
    })
    expect('error' in r).toBe(true)
  })

  it('includes valid entries and skips invalid ones in a mixed batch', () => {
    const r = validatePayload({
      logs: [
        { level: 'info', service: 'api', message: 'good' },
        { level: 'bad', service: 'api', message: 'invalid level' },
        { level: 'warn', service: 'api', message: 'also good' },
      ],
    })
    expect('payload' in r).toBe(true)
    if ('payload' in r) {
      expect(r.payload.logs).toHaveLength(2)
    }
  })

  it('preserves optional meta when valid object', () => {
    const r = validatePayload({
      logs: [{ level: 'info', service: 'api', message: 'x', meta: { key: 'val' } }],
    })
    expect('payload' in r).toBe(true)
    if ('payload' in r) {
      expect(r.payload.logs[0]?.meta).toEqual({ key: 'val' })
    }
  })

  it('omits meta when it is not a plain object', () => {
    const r = validatePayload({
      logs: [{ level: 'info', service: 'api', message: 'x', meta: [1, 2, 3] }],
    })
    expect('payload' in r).toBe(true)
    if ('payload' in r) {
      expect(r.payload.logs[0]?.meta).toBeUndefined()
    }
  })
})
