import type { LogEntry, LogLevel } from '@bunderlog/types'

const TTL = 86400 // 24h — long enough to be useful for stats

async function increment(kv: KVNamespace, key: string, by: number): Promise<void> {
  const current = parseInt((await kv.get(key)) ?? '0', 10)
  await kv.put(key, String(current + by), { expirationTtl: TTL })
}

export async function incrementCounters(kv: KVNamespace, entries: LogEntry[]): Promise<void> {
  if (entries.length === 0) return

  const byLevel = new Map<LogLevel, number>()
  const byService = new Map<string, number>()

  for (const e of entries) {
    byLevel.set(e.level, (byLevel.get(e.level) ?? 0) + 1)
    byService.set(e.service, (byService.get(e.service) ?? 0) + 1)
  }

  const ops: Promise<void>[] = [increment(kv, 'count:total', entries.length)]

  for (const [level, count] of byLevel) {
    ops.push(increment(kv, `count:level:${level}`, count))
  }
  for (const [service, count] of byService) {
    ops.push(increment(kv, `count:service:${service}`, count))
  }

  await Promise.all(ops)
}
