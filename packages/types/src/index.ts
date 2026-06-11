export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export const LOG_LEVELS: readonly LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal']

export function isLogLevel(value: unknown): value is LogLevel {
  return typeof value === 'string' && (LOG_LEVELS as readonly string[]).includes(value)
}

export interface LogEntry {
  id: string
  ts: number
  level: LogLevel
  service: string
  message: string
  meta: string | null
  ip: string | null
  country: string | null
  ray: string | null
  ingest_ts: number
}

export interface IngestRecord {
  ts: number
  level: LogLevel
  service: string
  message: string
  meta?: Record<string, unknown>
}

export interface IngestPayload {
  logs: IngestRecord[]
}

export interface LogsQueryParams {
  service?: string
  level?: LogLevel
  from?: number
  to?: number
  q?: string
  cursor?: string
  limit?: number
}

export interface LogsResponse {
  logs: LogEntry[]
  cursor: string | null
}

export interface StatsResponse {
  total: number
  byLevel: Record<LogLevel, number>
  byService: Record<string, number>
}
