// D1 queries: page events, waitlist signups and the aggregates behind /stats. Schema: migrations/.
import { VARIANTS, type Variant } from '../src/shared/variants'

/** First-touch attribution: the client captures it on the first visit and reuses it. */
export interface Attribution {
  source: string
  medium: string
  campaign: string
  referrer: string
}

export interface PageEvent extends Attribution {
  type: 'view' | 'engage'
  variant: Variant
  visitor: string
  forced: boolean
  country: string
}

export interface Signup extends Attribution {
  email: string
  variant: Variant
  visitor: string
  forced: boolean
  test: boolean
  country: string
  token: string
}

export interface Profile {
  token: string
  role: string
  teamSize: string
  pain: string
}

export interface Filter {
  /** YYYY-MM-DD, inclusive; empty for no limit */
  from: string
  source: string
  assign: 'random' | 'forced' | 'all'
}

export interface VariantStats {
  variant: Variant
  visitors: number
  engaged: number
  signups: number
  profiles: number
}

export interface Stats {
  variants: VariantStats[]
  sources: { source: string; variant: string; visitors: number; signups: number }[]
  roles: Count[]
  teamSizes: Count[]
  notes: { ts: string; variant: string; source: string; role: string; teamSize: string; pain: string }[]
  allSources: string[]
  /** Signups left out of Conversion because their Visitor never sent a `view` (e.g. a blocked beacon). */
  unseenSignups: number
}

interface Count {
  variant: string
  value: string
  n: number
}

const nullable = (s: string) => s || null

export async function addEvent(db: D1Database, e: PageEvent): Promise<void> {
  await db
    .prepare(
      `INSERT INTO events (visitor, variant, type, forced, source, medium, campaign, referrer, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(e.visitor, e.variant, e.type, Number(e.forced), e.source, nullable(e.medium), nullable(e.campaign), nullable(e.referrer), nullable(e.country))
    .run()
}

/** Returns false when the email is already on the list. */
export async function addSignup(db: D1Database, su: Signup): Promise<boolean> {
  const res = await db
    .prepare(
      `INSERT INTO waitlist (email, token, visitor, variant, forced, test, source, medium, campaign, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (email) DO NOTHING`,
    )
    .bind(su.email, su.token, nullable(su.visitor), su.variant, Number(su.forced), Number(su.test), su.source, nullable(su.medium), nullable(su.campaign), nullable(su.country))
    .run()
  return res.meta.changes === 1
}

/** Returns false when no signup has this token. */
export async function updateProfile(db: D1Database, p: Profile): Promise<boolean> {
  const res = await db
    .prepare('UPDATE waitlist SET role = ?, team_size = ?, pain = ? WHERE token = ?')
    .bind(nullable(p.role), nullable(p.teamSize), nullable(p.pain), p.token)
    .run()
  return res.meta.changes > 0
}

function where(f: Filter): [string, unknown[]] {
  const clauses = ['1 = 1']
  const args: unknown[] = []
  if (f.from) {
    clauses.push('ts >= ?')
    args.push(f.from)
  }
  if (f.source) {
    clauses.push('source = ?')
    args.push(f.source)
  }
  if (f.assign === 'random') clauses.push('forced = 0')
  else if (f.assign === 'forced') clauses.push('forced = 1')
  return [clauses.join(' AND '), args]
}

export async function stats(db: D1Database, f: Filter): Promise<Stats> {
  const [w, args] = where(f)
  const q = (sql: string) => db.prepare(sql).bind(...args)
  // A Signup counts toward Conversion only if its Visitor was seen under the same filter,
  // so every counted Signup is also among the Visitors it is divided by.
  const seen = `visitor IN (SELECT visitor FROM events WHERE type = 'view' AND ${w})`
  const qSeen = (sql: string) => db.prepare(sql).bind(...args, ...args)
  // One round trip; each result is read by position below.
  const [funnel, signups, profiles, srcViews, srcSignups, roles, teamSizes, notes, allSources, unseen] = await db.batch([
    // Visitors are distinct per variant; a visitor keeps one variant and one first-touch source.
    q(`SELECT variant,
         COUNT(DISTINCT CASE WHEN type = 'view' THEN visitor END) AS visitors,
         COUNT(DISTINCT CASE WHEN type = 'engage' THEN visitor END) AS engaged
       FROM events WHERE ${w} GROUP BY variant`),
    qSeen(`SELECT variant, COUNT(*) AS n FROM waitlist WHERE test = 0 AND ${w} AND ${seen} GROUP BY variant`),
    qSeen(`SELECT variant, COUNT(*) AS n FROM waitlist
       WHERE test = 0 AND (role IS NOT NULL OR team_size IS NOT NULL OR pain IS NOT NULL) AND ${w} AND ${seen} GROUP BY variant`),
    q(`SELECT source, variant, COUNT(DISTINCT visitor) AS n FROM events WHERE type = 'view' AND ${w} GROUP BY source, variant`),
    qSeen(`SELECT source, variant, COUNT(*) AS n FROM waitlist WHERE test = 0 AND ${w} AND ${seen} GROUP BY source, variant`),
    q(`SELECT variant, role AS value, COUNT(*) AS n FROM waitlist
       WHERE test = 0 AND role IS NOT NULL AND ${w} GROUP BY variant, role ORDER BY 3 DESC`),
    q(`SELECT variant, team_size AS value, COUNT(*) AS n FROM waitlist
       WHERE test = 0 AND team_size IS NOT NULL AND ${w} GROUP BY variant, team_size ORDER BY 3 DESC`),
    q(`SELECT ts, variant, source, COALESCE(role, '') AS role, COALESCE(team_size, '') AS teamSize, pain
       FROM waitlist WHERE test = 0 AND pain IS NOT NULL AND ${w} ORDER BY ts DESC LIMIT 200`),
    db.prepare('SELECT source FROM events UNION SELECT source FROM waitlist ORDER BY 1'),
    qSeen(`SELECT COUNT(*) AS n FROM waitlist WHERE test = 0 AND ${w} AND NOT (visitor IS NOT NULL AND ${seen})`),
  ])

  const byVariant = new Map(VARIANTS.map((v): [string, VariantStats] => [v, { variant: v, visitors: 0, engaged: 0, signups: 0, profiles: 0 }]))
  for (const r of funnel.results as { variant: string; visitors: number; engaged: number }[]) {
    const vs = byVariant.get(r.variant)
    if (vs) Object.assign(vs, { visitors: r.visitors, engaged: r.engaged })
  }
  for (const r of signups.results as { variant: string; n: number }[]) {
    const vs = byVariant.get(r.variant)
    if (vs) vs.signups = r.n
  }
  for (const r of profiles.results as { variant: string; n: number }[]) {
    const vs = byVariant.get(r.variant)
    if (vs) vs.profiles = r.n
  }

  const bySource = new Map<string, Stats['sources'][number]>()
  const sourceRow = (source: string, variant: string) => {
    const key = `${source}\n${variant}`
    let row = bySource.get(key)
    if (!row) {
      row = { source, variant, visitors: 0, signups: 0 }
      bySource.set(key, row)
    }
    return row
  }
  for (const r of srcViews.results as { source: string; variant: string; n: number }[]) sourceRow(r.source, r.variant).visitors = r.n
  for (const r of srcSignups.results as { source: string; variant: string; n: number }[]) sourceRow(r.source, r.variant).signups = r.n

  return {
    variants: [...byVariant.values()],
    sources: [...bySource.values()],
    roles: roles.results as Count[],
    teamSizes: teamSizes.results as Count[],
    notes: notes.results as Stats['notes'],
    allSources: (allSources.results as { source: string }[]).map((r) => r.source),
    unseenSignups: (unseen.results as { n: number }[])[0].n,
  }
}

/** Every signup, oldest first, as CSV cells in the export's column order. */
export async function exportWaitlist(db: D1Database): Promise<string[][]> {
  const rows = await db
    .prepare(
      `SELECT ts, email, variant, forced, test, source,
         COALESCE(medium, ''), COALESCE(campaign, ''), COALESCE(country, ''),
         COALESCE(role, ''), COALESCE(team_size, ''), COALESCE(pain, '')
       FROM waitlist ORDER BY ts`,
    )
    .raw<(string | number)[]>()
  return rows.map((row) => row.map(String))
}
