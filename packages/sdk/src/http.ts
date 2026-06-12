import type { IngestPayload } from '@bunderlog/types'

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 500

export async function postBatch(
  endpoint: string,
  token: string,
  payload: IngestPayload,
): Promise<void> {
  let delay = BASE_DELAY_MS
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const res = await globalThis
      .fetch(`${endpoint}/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Log-Token': token,
        },
        body: JSON.stringify(payload),
      })
      .catch(() => null)

    if (res && (res.ok || res.status < 500)) return

    if (attempt < MAX_ATTEMPTS - 1) {
      await new Promise<void>((r) => setTimeout(r, delay)).catch(() => {})
      delay *= 2
    }
  }
}
