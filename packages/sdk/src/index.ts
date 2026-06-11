import type { IngestRecord, LogLevel } from '@bunderlog/types'
import { postBatch } from './http.js'

export type { LogLevel } from '@bunderlog/types'
export type {
  IngestRecord,
  IngestPayload,
  LogEntry,
  LogsQueryParams,
  LogsResponse,
  StatsResponse,
} from '@bunderlog/types'

export interface LoggerConfig {
  endpoint?: string
  token?: string
  service: string
  batchSize?: number
  flushMs?: number
}

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void
  info(message: string, meta?: Record<string, unknown>): void
  warn(message: string, meta?: Record<string, unknown>): void
  error(message: string, meta?: Record<string, unknown>): void
  fatal(message: string, meta?: Record<string, unknown>): void
  flush(): Promise<void>
}

const NOOP: Logger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
  flush: async () => {},
}

export function logger(config: LoggerConfig): Logger {
  const { endpoint, token, service, batchSize = 20, flushMs = 2000 } = config

  if (!endpoint || !token) {
    console.warn('[bunderlog] endpoint and token are required — logging disabled')
    return NOOP
  }

  const buffer: IngestRecord[] = []
  let timer: ReturnType<typeof setTimeout> | null = null

  function scheduleFlush() {
    if (timer !== null) return
    timer = setTimeout(() => {
      timer = null
      void flush()
    }, flushMs)
  }

  function push(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    buffer.push({
      ts: Date.now(),
      level,
      service,
      message,
      ...(meta !== undefined ? { meta } : {}),
    })
    if (buffer.length >= batchSize) {
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      void flush()
    } else {
      scheduleFlush()
    }
  }

  async function flush(): Promise<void> {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    if (buffer.length === 0) return
    const batch = buffer.splice(0)
    await postBatch(endpoint, token, { logs: batch })
  }

  return {
    debug: (m, meta) => push('debug', m, meta),
    info: (m, meta) => push('info', m, meta),
    warn: (m, meta) => push('warn', m, meta),
    error: (m, meta) => push('error', m, meta),
    fatal: (m, meta) => push('fatal', m, meta),
    flush,
  }
}
