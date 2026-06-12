import { isLogLevel } from '@bunderlog/types'
import type { IngestPayload, IngestRecord } from '@bunderlog/types'

export interface ValidationError {
  index: number
  field: string
  message: string
}

export interface ValidationResult {
  valid: IngestRecord[]
  errors: ValidationError[]
}

export function validatePayload(body: unknown): { payload: IngestPayload } | { error: string } {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object' }
  }

  const raw = body as Record<string, unknown>

  if (!Array.isArray(raw['logs'])) {
    return { error: 'Field "logs" must be an array' }
  }

  const logs = raw['logs'] as unknown[]

  if (logs.length === 0) {
    return { error: 'Field "logs" must not be empty' }
  }

  if (logs.length > 500) {
    return { error: 'Field "logs" must not exceed 500 entries' }
  }

  const valid: IngestRecord[] = []
  const errors: ValidationError[] = []

  for (const [i, entry] of logs.entries()) {
    if (typeof entry !== 'object' || entry === null) {
      errors.push({ index: i, field: 'entry', message: 'Must be an object' })
      continue
    }

    const e = entry as Record<string, unknown>
    const entryErrors: ValidationError[] = []

    if (typeof e['service'] !== 'string' || e['service'].length === 0) {
      entryErrors.push({ index: i, field: 'service', message: 'Required string' })
    } else if (e['service'].length > 64) {
      entryErrors.push({ index: i, field: 'service', message: 'Must not exceed 64 characters' })
    }

    if (!isLogLevel(e['level'])) {
      entryErrors.push({
        index: i,
        field: 'level',
        message: 'Must be one of: debug, info, warn, error, fatal',
      })
    }

    if (typeof e['message'] !== 'string' || e['message'].length === 0) {
      entryErrors.push({ index: i, field: 'message', message: 'Required string' })
    } else if (e['message'].length > 4096) {
      entryErrors.push({ index: i, field: 'message', message: 'Must not exceed 4096 characters' })
    }

    if (entryErrors.length > 0) {
      errors.push(...entryErrors)
      continue
    }

    const record: IngestRecord = {
      ts: typeof e['ts'] === 'number' ? e['ts'] : Date.now(),
      level: e['level'] as IngestRecord['level'],
      service: e['service'] as string,
      message: e['message'] as string,
    }

    if (typeof e['meta'] === 'object' && e['meta'] !== null && !Array.isArray(e['meta'])) {
      record.meta = e['meta'] as Record<string, unknown>
    }

    valid.push(record)
  }

  if (valid.length === 0) {
    return {
      error: `All entries failed validation: ${errors.map((e) => `[${e.index}] ${e.field}: ${e.message}`).join(', ')}`,
    }
  }

  return { payload: { logs: valid } }
}
