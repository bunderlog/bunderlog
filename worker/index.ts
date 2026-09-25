// The experiment's API: page events, waitlist signups, the optional survey and token-protected stats.
// Pages and assets never reach this code; wrangler.jsonc routes only /api/* and /healthz here.
import { isVariant } from '../src/shared/variants'
import { addEvent, addSignup, exportWaitlist, stats, updateProfile, type Attribution, type Filter } from './store'

export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url)
    try {
      switch (`${request.method} ${pathname}`) {
        case 'POST /api/event':
          return await handleEvent(request, env)
        case 'POST /api/waitlist':
          return await handleWaitlist(request, env)
        case 'POST /api/profile':
          return await handleProfile(request, env)
        case 'GET /api/stats':
          return (await unauthorized(request, env)) ?? (await handleStats(request, env))
        case 'GET /api/export.csv':
          return (await unauthorized(request, env)) ?? (await handleExport(env))
        case 'GET /healthz':
          return new Response('ok')
      }
      return json(404, { ok: false, error: 'not found' })
    } catch (err) {
      console.error(pathname, err)
      return json(500, { ok: false, error: 'Something went wrong, please try again.' })
    }
  },
} satisfies ExportedHandler<Env>

const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|embedly|curl|wget|python-requests|go-http-client/i

async function handleEvent(request: Request, env: Env): Promise<Response> {
  // Beacons are fire-and-forget: never make the page wait or retry.
  const ua = request.headers.get('user-agent') ?? ''
  if (!ua || BOT_UA.test(ua) || !(await allowed(env.EVENT_LIMIT, request))) return new Response(null, { status: 204 })
  const body = await readJSON(request)
  if (!body) return badRequest('invalid json')
  const type = str(body.type, 16)
  if (type !== 'view' && type !== 'engage') return badRequest('unknown event type')
  if (!isVariant(body.variant)) return badRequest('unknown variant')
  const visitor = str(body.visitor, 64)
  if (!visitor) return badRequest('missing visitor')
  await addEvent(env.DB, { type, variant: body.variant, visitor, forced: body.forced === true, country: country(request), ...attribution(body) })
  return new Response(null, { status: 204 })
}

async function handleWaitlist(request: Request, env: Env): Promise<Response> {
  if (!(await allowed(env.JOIN_LIMIT, request))) return json(429, { ok: false, error: 'Too many attempts, try again in a minute.' })
  const body = await readJSON(request)
  if (!body) return badRequest('invalid json')
  // Honeypot: humans never see the field. Pretend success so bots don't learn to skip it.
  if (str(body.website, 300)) return json(200, { ok: true })
  const email = normalizeEmail(str(body.email, 300))
  if (!email) return json(400, { ok: false, error: 'That doesn’t look like a valid email.' })
  if (!isVariant(body.variant)) return badRequest('unknown variant')
  const su = {
    email,
    variant: body.variant,
    visitor: str(body.visitor, 64),
    forced: body.forced === true,
    test: body.test === true,
    country: country(request),
    token: randomToken(),
    ...attribution(body),
  }
  if (!(await addSignup(env.DB, su))) return json(200, { ok: true, duplicate: true })
  console.log('waitlist signup', { variant: su.variant, source: su.source, test: su.test })
  return json(200, { ok: true, token: su.token })
}

async function handleProfile(request: Request, env: Env): Promise<Response> {
  if (!(await allowed(env.JOIN_LIMIT, request))) return json(429, { ok: false })
  const body = await readJSON(request)
  if (!body) return badRequest('invalid json')
  const token = str(body.token, 64)
  if (!token) return badRequest('missing token')
  const found = await updateProfile(env.DB, {
    token,
    role: str(body.role, 80),
    teamSize: str(body.teamSize, 20),
    pain: str(body.pain, 2000),
  })
  return found ? json(200, { ok: true }) : json(404, { ok: false })
}

async function handleStats(request: Request, env: Env): Promise<Response> {
  const q = new URL(request.url).searchParams
  const from = q.get('from') ?? ''
  if (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) return badRequest('from must be YYYY-MM-DD')
  const assign = q.get('assign')
  const f: Filter = { from, source: q.get('source') ?? '', assign: assign === 'forced' || assign === 'all' ? assign : 'random' }
  return json(200, await stats(env.DB, f), { 'cache-control': 'no-store' })
}

const CSV_HEADER = ['ts', 'email', 'variant', 'forced', 'test', 'source', 'medium', 'campaign', 'country', 'role', 'team_size', 'pain']

async function handleExport(env: Env): Promise<Response> {
  const rows = [CSV_HEADER, ...(await exportWaitlist(env.DB)).map((row) => row.map(neutraliseFormula))]
  const csv = rows.map((row) => row.map(csvCell).join(',') + '\r\n').join('')
  return new Response(csv, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="bunderlog-waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
      'cache-control': 'no-store',
    },
  })
}

/** Neutralises spreadsheet formula injection from user-supplied text. */
const neutraliseFormula = (v: string) => (v && '=+-@\t\r'.includes(v[0]) ? `'${v}` : v)

const csvCell = (v: string) => (/[",\r\n]/.test(v) ? `"${v.replaceAll('"', '""')}"` : v)

/** Returns a 401/503 response, or null when the request carries the stats token. */
async function unauthorized(request: Request, env: Env): Promise<Response | null> {
  if (!env.STATS_TOKEN) return new Response('stats disabled: set the STATS_TOKEN secret', { status: 503 })
  const got = (request.headers.get('authorization') ?? '').replace(/^Bearer /, '')
  const enc = new TextEncoder()
  const [a, b] = [enc.encode(got), enc.encode(env.STATS_TOKEN)]
  if (a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b)) return null
  return new Response('unauthorized', { status: 401 })
}

async function allowed(limiter: RateLimit, request: Request): Promise<boolean> {
  const { success } = await limiter.limit({ key: request.headers.get('cf-connecting-ip') ?? 'local' })
  return success
}

function country(request: Request): string {
  const c = request.cf?.country
  return typeof c === 'string' ? c.slice(0, 2) : ''
}

/** The body as a JSON object, or null when it isn't one. sendBeacon posts text/plain, so the content type isn't checked. */
async function readJSON(request: Request): Promise<Record<string, unknown> | null> {
  const text = await request.text()
  if (text.length > 16 << 10) return null
  try {
    const v: unknown = JSON.parse(text)
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null
  } catch {
    return null
  }
}

/** A trimmed string of at most n characters; '' for anything that isn't a string. */
function str(v: unknown, n: number): string {
  return typeof v === 'string' ? v.trim().slice(0, n).trim() : ''
}

function attribution(body: Record<string, unknown>): Attribution {
  return {
    source: str(body.source, 64).toLowerCase() || 'direct',
    medium: str(body.medium, 64).toLowerCase(),
    campaign: str(body.campaign, 128),
    referrer: str(body.referrer, 300),
  }
}

/** The lowercased address, or null when it isn't a plausible single email address. */
function normalizeEmail(raw: string): string | null {
  const s = raw.trim().toLowerCase()
  if (s.length > 254 || !/^[^\s@"(),:;<>[\\\]]+@[^\s@"(),:;<>[\\\]]+$/.test(s)) return null
  const domain = s.slice(s.indexOf('@') + 1)
  if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.') || domain.includes('..')) return null
  return s
}

function randomToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
}

function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { 'x-content-type-options': 'nosniff', ...headers } })
}

const badRequest = (error: string) => json(400, { ok: false, error })
