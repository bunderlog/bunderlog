import type { LogEntry } from '@bunderlog/types'

const POLL_MS = 1000
const MAX_DURATION_MS = 25_000

export function handleTail(request: Request, db: D1Database): Response {
  const url = new URL(request.url)
  const afterId = request.headers.get('Last-Event-ID') ?? url.searchParams.get('after') ?? null

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder()
      let lastId = afterId
      const deadline = Date.now() + MAX_DURATION_MS

      const send = (event: string, data: unknown) => {
        controller.enqueue(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
      }

      const poll = async () => {
        const condition = lastId ? 'WHERE ingest_ts > ?' : 'ORDER BY ingest_ts DESC LIMIT 50'
        const sql = lastId
          ? 'SELECT * FROM logs WHERE ingest_ts > ? ORDER BY ingest_ts ASC LIMIT 100'
          : 'SELECT * FROM logs ORDER BY ingest_ts DESC LIMIT 50'

        const { results } = await db
          .prepare(sql)
          .bind(...(lastId ? [lastId] : []))
          .all<LogEntry>()

        void condition
        const ordered = lastId ? results : [...results].reverse()

        for (const entry of ordered) {
          send('log', entry)
          lastId = entry.ingest_ts.toString()
        }
      }

      try {
        await poll()
        while (Date.now() < deadline) {
          await new Promise((r) => setTimeout(r, POLL_MS))
          await poll()
        }
      } catch {
        // stream ends on error — client will reconnect via Last-Event-ID
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
