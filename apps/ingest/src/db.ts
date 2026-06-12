import type { LogEntry, QueueMessage } from '@bunderlog/types'

export function toLogEntry(msg: QueueMessage): LogEntry {
  return {
    id: crypto.randomUUID(),
    ts: msg.ts,
    level: msg.level,
    service: msg.service,
    message: msg.message,
    meta: msg.meta ? JSON.stringify(msg.meta) : null,
    ip: msg.ip,
    country: msg.country,
    ray: msg.ray,
    ingest_ts: Date.now(),
  }
}

export async function insertBatch(db: D1Database, entries: LogEntry[]): Promise<void> {
  const stmts = entries.map((e) =>
    db
      .prepare(
        'INSERT INTO logs (id, ts, level, service, message, meta, ip, country, ray, ingest_ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      )
      .bind(e.id, e.ts, e.level, e.service, e.message, e.meta, e.ip, e.country, e.ray, e.ingest_ts),
  )
  await db.batch(stmts)
}
