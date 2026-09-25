import { isVariant, VARIANTS, type Variant } from './variants'

export { isVariant, VARIANTS, type Variant }

export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value)
    } catch {
      /* private mode: the experiment still works for this page view */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  },
}

export interface Attribution {
  source: string
  medium: string
  campaign: string
  referrer: string
}

export interface Experiment {
  variant: Variant
  /** Assigned via ?v= on the first visit (e.g. a targeted ad) rather than randomly — excluded from the A/B by default. */
  forced: boolean
  visitor: string
  /** ?notrack marks this browser as internal: no events, signups flagged as test. */
  noTrack: boolean
  attribution: Attribution
}

function randomId(): string {
  if (crypto.randomUUID) return crypto.randomUUID()
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('')
}

function firstTouch(qs: URLSearchParams): Attribution {
  const saved = storage.get('bl_attr')
  if (saved) {
    try {
      return JSON.parse(saved) as Attribution
    } catch {
      /* fall through and recompute */
    }
  }
  let refHost = ''
  try {
    const ref = document.referrer ? new URL(document.referrer) : null
    if (ref && ref.host !== location.host) refHost = ref.hostname.replace(/^www\./, '')
  } catch {
    /* malformed referrer */
  }
  const attr: Attribution = {
    source: qs.get('utm_source') || qs.get('ref') || refHost || 'direct',
    medium: qs.get('utm_medium') || '',
    campaign: qs.get('utm_campaign') || '',
    referrer: document.referrer.slice(0, 300),
  }
  storage.set('bl_attr', JSON.stringify(attr))
  return attr
}

export function initExperiment(): Experiment {
  const qs = new URLSearchParams(location.search)
  if (qs.has('notrack')) storage.set('bl_nt', '1')
  if (qs.has('track')) storage.remove('bl_nt')

  const noTrack = storage.get('bl_nt') === '1'
  const stored = storage.get('bl_v')
  const requested = qs.get('v')
  let variant: Variant
  let forced: boolean
  // The first assignment is final, so a Visitor never counts toward two variants;
  // only an internal browser may switch with ?v= to preview the others.
  if (isVariant(requested) && (noTrack || !isVariant(stored))) {
    variant = requested
    forced = true
  } else if (isVariant(stored)) {
    variant = stored
    forced = storage.get('bl_forced') === '1'
  } else {
    variant = VARIANTS[crypto.getRandomValues(new Uint32Array(1))[0] % VARIANTS.length]
    forced = false
  }
  storage.set('bl_v', variant)
  storage.set('bl_forced', forced ? '1' : '0')

  let visitor = storage.get('bl_vid')
  if (!visitor) {
    visitor = randomId()
    storage.set('bl_vid', visitor)
  }

  return {
    variant,
    forced,
    visitor,
    noTrack,
    attribution: firstTouch(qs),
  }
}

export function track(exp: Experiment, type: 'view' | 'engage') {
  if (exp.noTrack) return
  const body = JSON.stringify({
    type,
    variant: exp.variant,
    visitor: exp.visitor,
    forced: exp.forced,
    ...exp.attribution,
  })
  // text/plain keeps the beacon a "simple" request with no CORS preflight.
  if (!navigator.sendBeacon?.('/api/event', new Blob([body], { type: 'text/plain' }))) {
    fetch('/api/event', { method: 'POST', body, keepalive: true }).catch(() => {})
  }
}
