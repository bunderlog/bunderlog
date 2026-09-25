// Gives the tests the real schema and an empty database per test (storage is shared within a test file).
import { applyD1Migrations } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { beforeEach } from 'vitest'

await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)

beforeEach(async () => {
  await env.DB.batch([env.DB.prepare('DELETE FROM events'), env.DB.prepare('DELETE FROM waitlist')])
})
