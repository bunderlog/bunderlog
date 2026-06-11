import { describe, expect, it } from 'vitest'
import { decodeCursor, encodeCursor } from '../src/cursor'

describe('cursor', () => {
  it('round-trips ts and id', () => {
    const encoded = encodeCursor(1234567890, 'abc-def')
    const decoded = decodeCursor(encoded)
    expect(decoded).toEqual({ ts: 1234567890, id: 'abc-def' })
  })

  it('returns null for invalid base64', () => {
    expect(decodeCursor('!!not-base64!!')).toBeNull()
  })

  it('returns null for valid base64 but wrong shape', () => {
    expect(decodeCursor(btoa('{"foo":"bar"}'))).toBeNull()
    expect(decodeCursor(btoa('"just-a-string"'))).toBeNull()
  })
})
