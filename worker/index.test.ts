// End-to-end through the Worker's fetch handler, against a local D1 with the real migrations.
import { exports } from 'cloudflare:workers'
import { expect, it } from 'vitest'

const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15'

function call(path: string, init: RequestInit = {}) {
  return exports.default.fetch(`https://bunderlog.test${path}`, init)
}

async function post(path: string, body: string, ua = BROWSER_UA) {
  const res = await call(path, { method: 'POST', body, headers: { 'user-agent': ua } })
  const text = await res.text()
  return { status: res.status, body: (text ? JSON.parse(text) : {}) as Record<string, unknown> }
}

async function getStats(query = '') {
  const res = await call(`/api/stats?${query}`, { headers: { authorization: 'Bearer secret' } })
  expect(res.status).toBe(200)
  const s = (await res.json()) as { variants: { variant: string }[]; notes: { pain: string }[]; sources: unknown[]; unseenSignups: number }
  return { ...s, variant: (v: string) => s.variants.find((x) => x.variant === v) }
}

it('counts visitors, signups and survey answers per variant, leaving out forced, test, honeypot and bot traffic', async () => {
  // Two random visitors on A (one views twice), one on B, one forced onto C.
  for (const body of [
    '{"type":"view","variant":"a","visitor":"v1","source":"HN"}',
    '{"type":"view","variant":"a","visitor":"v1","source":"hn"}',
    '{"type":"engage","variant":"a","visitor":"v1","source":"hn"}',
    '{"type":"view","variant":"a","visitor":"v2"}',
    '{"type":"view","variant":"b","visitor":"v3","source":"reddit"}',
    '{"type":"view","variant":"c","visitor":"v4","forced":true,"source":"ads"}',
  ]) {
    expect((await post('/api/event', body)).status, body).toBe(204)
  }

  const signup = await post('/api/waitlist', '{"email":" Jane@Example.com ","variant":"a","visitor":"v1","source":"hn"}')
  expect(signup.status).toBe(200)
  const token = signup.body.token
  expect(token).toMatch(/^[0-9a-f]{32}$/)

  expect((await post('/api/waitlist', '{"email":"jane@example.com","variant":"b","visitor":"x"}')).body).toEqual({ ok: true, duplicate: true })
  expect((await post('/api/waitlist', '{"email":"not-an-email","variant":"a"}')).status).toBe(400)
  // Honeypot and internal test signups must not count.
  expect((await post('/api/waitlist', '{"email":"bot@spam.com","variant":"a","website":"http://spam"}')).body).toEqual({ ok: true })
  await post('/api/waitlist', '{"email":"me@team.com","variant":"a","test":true}')
  await post('/api/waitlist', '{"email":"ad@click.com","variant":"c","visitor":"v4","forced":true,"source":"ads"}')

  expect((await post('/api/profile', `{"token":"${token}","role":"AI / ML engineer","teamSize":"2–10","pain":"grep"}`)).status).toBe(200)
  expect((await post('/api/profile', '{"token":"nope","role":"x"}')).status).toBe(404)

  const s = await getStats()
  expect(s.variant('a')).toEqual({ variant: 'a', visitors: 2, engaged: 1, signups: 1, profiles: 1 })
  expect(s.variant('c')).toMatchObject({ visitors: 0, signups: 0 })
  expect(s.notes.map((n) => n.pain)).toEqual(['grep'])

  expect((await getStats('assign=forced')).variant('c')).toMatchObject({ visitors: 1, signups: 1 })
  expect((await getStats('source=hn')).variant('a')).toMatchObject({ visitors: 1, signups: 1 })

  // Bots are ignored silently.
  expect((await post('/api/event', '{"type":"view","variant":"b","visitor":"bot"}', 'Googlebot/2.1')).status).toBe(204)
  expect((await getStats()).variant('b')).toMatchObject({ visitors: 1 })
})

it('counts a signup toward conversion only when its visitor was seen', async () => {
  await post('/api/event', '{"type":"view","variant":"a","visitor":"seen","source":"hn"}')
  await post('/api/waitlist', '{"email":"seen@example.com","variant":"a","visitor":"seen","source":"hn"}')
  // Blocked beacon: the signup arrives, the view never did.
  await post('/api/waitlist', '{"email":"unseen@example.com","variant":"a","visitor":"ghost","source":"hn"}')
  await post('/api/waitlist', '{"email":"novisitor@example.com","variant":"a","source":"hn"}')

  const s = await getStats()
  expect(s.variant('a')).toMatchObject({ visitors: 1, signups: 1 })
  expect(s.unseenSignups).toBe(2)
  expect(s.sources).toEqual([{ source: 'hn', variant: 'a', visitors: 1, signups: 1 }])
})

it('rejects events with an unknown type or variant', async () => {
  expect((await post('/api/event', '{"type":"click","variant":"a","visitor":"v1"}')).status).toBe(400)
  expect((await post('/api/event', '{"type":"view","variant":"z","visitor":"v1"}')).status).toBe(400)
  expect((await post('/api/event', 'not json')).status).toBe(400)
})

it('keeps stats and the export behind the token', async () => {
  for (const path of ['/api/stats', '/api/export.csv']) {
    expect((await call(path)).status, path).toBe(401)
    expect((await call(path, { headers: { authorization: 'Bearer wrong' } })).status, path).toBe(401)
  }
})

it('neutralises spreadsheet formulas in the CSV export', async () => {
  const { body } = await post('/api/waitlist', '{"email":"x@y.com","variant":"a"}')
  await post('/api/profile', `{"token":"${body.token}","pain":"=HYPERLINK(\\"http://evil\\")"}`)

  const res = await call('/api/export.csv', { headers: { authorization: 'Bearer secret' } })
  expect(res.headers.get('content-type')).toBe('text/csv; charset=utf-8')
  const csv = await res.text()
  expect(csv.split('\r\n')[0]).toBe('ts,email,variant,forced,test,source,medium,campaign,country,role,team_size,pain')
  expect(csv).toContain(`,x@y.com,a,0,0,direct,,,,,,"'=HYPERLINK(""http://evil"")"\r\n`)
})
