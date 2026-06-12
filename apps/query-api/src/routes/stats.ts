import { LOG_LEVELS } from '@bunderlog/types'
import type { StatsResponse } from '@bunderlog/types'

export async function handleStats(db: D1Database, kv: KVNamespace): Promise<Response> {
  const [totalRaw, levelKeys, serviceKeys] = await Promise.all([
    kv.get('count:total'),
    Promise.all(LOG_LEVELS.map(async (l) => ({ level: l, val: await kv.get(`count:level:${l}`) }))),
    kv.list({ prefix: 'count:service:' }),
  ])

  const total = totalRaw
    ? parseInt(totalRaw, 10)
    : await countFromDb(db, 'SELECT COUNT(*) AS n FROM logs')

  const byLevel = Object.fromEntries(
    await Promise.all(
      levelKeys.map(async ({ level, val }) => {
        const count = val
          ? parseInt(val, 10)
          : await countFromDb(db, `SELECT COUNT(*) AS n FROM logs WHERE level = '${level}'`)
        return [level, count] as const
      }),
    ),
  ) as StatsResponse['byLevel']

  const byService: Record<string, number> = {}
  for (const key of serviceKeys.keys) {
    const service = key.name.replace('count:service:', '')
    const val = await kv.get(key.name)
    // eslint-disable-next-line security/detect-object-injection
    byService[service] = val ? parseInt(val, 10) : 0
  }

  return Response.json({ total, byLevel, byService } satisfies StatsResponse)
}

async function countFromDb(db: D1Database, sql: string): Promise<number> {
  const row = await db.prepare(sql).first<{ n: number }>()
  return row?.n ?? 0
}
