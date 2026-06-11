import type { LogEntry } from '@bunderlog/types'

function archivePath(ts: number): string {
  const d = new Date(ts)
  const yyyy = d.getUTCFullYear()
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(d.getUTCDate()).padStart(2, '0')
  const hh = String(d.getUTCHours()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}/${hh}/${ts}-${crypto.randomUUID()}.ndjson`
}

export async function archiveBatch(bucket: R2Bucket, entries: LogEntry[]): Promise<void> {
  if (entries.length === 0) return
  const ts = entries[0]?.ingest_ts ?? Date.now()
  const ndjson = entries.map((e) => JSON.stringify(e)).join('\n')
  await bucket.put(archivePath(ts), ndjson, {
    httpMetadata: { contentType: 'application/x-ndjson' },
  })
}
