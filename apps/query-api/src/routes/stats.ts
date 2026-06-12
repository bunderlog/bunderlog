import { LOG_LEVELS } from '@bunderlog/types'
import type { StatsResponse } from '@bunderlog/types'

export async function handleStats(db: D1Database): Promise<Response> {
  const [total, levelRows, serviceRows] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM logs').first<{ n: number }>(),
    db
      .prepare('SELECT level, COUNT(*) AS n FROM logs GROUP BY level')
      .all<{ level: string; n: number }>(),
    db
      .prepare('SELECT service, COUNT(*) AS n FROM logs GROUP BY service')
      .all<{ service: string; n: number }>(),
  ])

  const byLevel = Object.fromEntries(
    LOG_LEVELS.map((l) => [l, levelRows.results.find((r) => r.level === l)?.n ?? 0]),
  ) as StatsResponse['byLevel']

  const byService = Object.fromEntries(serviceRows.results.map((r) => [r.service, r.n])) as Record<
    string,
    number
  >

  return Response.json({ total: total?.n ?? 0, byLevel, byService } satisfies StatsResponse)
}
