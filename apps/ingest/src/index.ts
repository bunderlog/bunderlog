import type { IngestRecord } from '@bunderlog/types'
import { validatePayload } from './validate'

interface Env {
  QUEUE: Queue<IngestRecord>
  LOG_TOKEN: string
  MAX_BATCH_SIZE?: string
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' }, 405)
    }

    const url = new URL(request.url)
    if (url.pathname !== '/ingest') {
      return json({ error: 'Not found', code: 'NOT_FOUND' }, 404)
    }

    const token = request.headers.get('X-Log-Token')
    if (!token || token !== env.LOG_TOKEN) {
      return json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, 401)
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return json({ error: 'Invalid JSON body', code: 'INVALID_JSON' }, 400)
    }

    const result = validatePayload(body)
    if ('error' in result) {
      return json({ error: result.error, code: 'VALIDATION_ERROR' }, 400)
    }

    const { logs } = result.payload
    const cf = request.cf ?? {}

    const messages = logs.map((log) => ({
      body: {
        ...log,
        ip: (cf['connectingIp'] as string | undefined) ?? null,
        country: (cf['country'] as string | undefined) ?? null,
        ray: request.headers.get('cf-ray') ?? null,
      },
    }))

    await env.QUEUE.sendBatch(messages)

    return json({ accepted: messages.length }, 202)
  },
} satisfies ExportedHandler<Env>
