import { handleLog } from './routes/log'
import { handleLogs } from './routes/logs'
import { handleStats } from './routes/stats'
import { handleTail } from './routes/tail'

interface Env {
  DB: D1Database
  WEB_ORIGIN?: string
}

const CORS_HEADERS = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
})

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.WEB_ORIGIN ?? '*'

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS(origin) })
    }

    if (request.method !== 'GET') {
      return Response.json(
        { error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' },
        { status: 405 },
      )
    }

    const url = new URL(request.url)
    const { pathname } = url

    let response: Response

    if (pathname === '/logs') {
      response = await handleLogs(request, env.DB)
    } else if (pathname === '/stats') {
      response = await handleStats(env.DB)
    } else if (pathname === '/tail') {
      response = handleTail(request, env.DB)
    } else if (pathname.startsWith('/logs/') && pathname.length > 6) {
      const id = pathname.slice(6)
      response = await handleLog(id, env.DB)
    } else {
      response = Response.json({ error: 'Not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const headers = new Headers(response.headers)
    for (const [k, v] of Object.entries(CORS_HEADERS(origin))) {
      headers.set(k, v)
    }

    return new Response(response.body, { status: response.status, headers })
  },
} satisfies ExportedHandler<Env>
