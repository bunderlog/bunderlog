interface CursorData {
  ts: number
  id: string
}

export function encodeCursor(ts: number, id: string): string {
  return btoa(JSON.stringify({ ts, id }))
}

export function decodeCursor(raw: string): CursorData | null {
  try {
    const data = JSON.parse(atob(raw)) as unknown
    if (
      typeof data === 'object' &&
      data !== null &&
      typeof (data as CursorData).ts === 'number' &&
      typeof (data as CursorData).id === 'string'
    ) {
      return data as CursorData
    }
    return null
  } catch {
    return null
  }
}
