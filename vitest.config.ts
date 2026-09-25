import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig(async () => ({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
      miniflare: {
        bindings: { STATS_TOKEN: 'secret', TEST_MIGRATIONS: await readD1Migrations('migrations') },
        // Tests send many requests from one client; the real limits are in wrangler.jsonc.
        ratelimits: {
          EVENT_LIMIT: { namespace_id: '1001', simple: { limit: 1000, period: 60 } },
          JOIN_LIMIT: { namespace_id: '1002', simple: { limit: 1000, period: 60 } },
        },
      },
    }),
  ],
  test: {
    include: ['worker/**/*.test.ts'],
    setupFiles: ['./worker/test-setup.ts'],
  },
}))
