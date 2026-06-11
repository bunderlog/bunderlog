import type { QueueMessage } from '@bunderlog/types'
import { insertBatch, toLogEntry } from './db'
import { incrementCounters } from './kv'
import { archiveBatch } from './r2'

interface Env {
  DB: D1Database
  ARCHIVE: R2Bucket
  COUNTERS: KVNamespace
}

export default {
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    const entries = batch.messages.map((m) => toLogEntry(m.body))

    await Promise.all([
      insertBatch(env.DB, entries),
      archiveBatch(env.ARCHIVE, entries),
      incrementCounters(env.COUNTERS, entries),
    ])

    batch.ackAll()
  },
} satisfies ExportedHandler<Env>
