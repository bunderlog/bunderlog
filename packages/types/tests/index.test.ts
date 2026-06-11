import { describe, expect, it } from 'vitest'
import { LOG_LEVELS, isLogLevel } from '../src/index'

describe('LOG_LEVELS', () => {
  it('contains all five levels in severity order', () => {
    expect(LOG_LEVELS).toEqual(['debug', 'info', 'warn', 'error', 'fatal'])
  })
})

describe('isLogLevel', () => {
  it.each(LOG_LEVELS)('returns true for valid level "%s"', (level) => {
    expect(isLogLevel(level)).toBe(true)
  })

  it.each([undefined, null, 0, '', 'verbose', 'INFO', 'DEBUG'])(
    'returns false for invalid value %s',
    (value) => {
      expect(isLogLevel(value)).toBe(false)
    },
  )
})
