import type { Variant } from './experiment'

// All landing copy lives here; to rename the product, change BRAND and DOMAIN.
// Each variant is a different positioning of the same product,
// so the A/B test compares positionings, not layouts. Keep claims to what we intend to build.

export const BRAND = 'bunderlog'
export const DOMAIN = 'bunderlog.com'
export const CONTACT_EMAIL = `hello@${DOMAIN}`

// One button text for every variant: it isn't part of the positioning, so it must not differ between them.
export const CTA = 'Join the waitlist'

export interface TermLine {
  /** left column: timestamp, service or actor */
  meta: string
  /** level/kind tag, drives the color: ok | info | warn | err | seal */
  tag: string
  kind: 'ok' | 'info' | 'warn' | 'err' | 'seal'
  text: string
}

export interface Feature {
  tag: string
  title: string
  body: string
}

export interface VariantCopy {
  /** internal name used on the stats page */
  label: string
  title: string
  description: string
  eyebrow: string
  headline: { pre: string; em: string; post: string }
  lede: string
  termTitle: string
  term: TermLine[]
  problemTitle: string
  problem: string
  features: Feature[]
  howTitle: string
  steps: string[]
  code: { file: string; lang: 'python' | 'ts' | 'bash'; source: string }
  finalTitle: string
  finalBody: string
  roles: string[]
  painQuestion: string
}

export const TEAM_SIZES = ['Just me', '2–10', '11–50', '51–200', '200+']

export const COPY: Record<Variant, VariantCopy> = {
  a: {
    label: 'Flight recorder for AI agents',
    title: `${BRAND} — a flight recorder for AI agents`,
    description:
      'Capture every prompt, tool call and decision your AI agents make in a tamper-evident log you can replay, search and hand to an auditor.',
    eyebrow: 'For teams putting AI agents into production',
    headline: { pre: 'A flight recorder for your ', em: 'AI agents', post: '.' },
    lede: 'Capture every prompt, tool call and decision your agents make — in a tamper-evident log you can replay step by step, search in seconds and hand straight to an auditor.',
    termTitle: 'run_8f2c · support-agent',
    term: [
      { meta: '10:42:07.114', tag: 'start', kind: 'info', text: 'task="Refund order #4471"' },
      { meta: '10:42:07.389', tag: 'llm', kind: 'info', text: 'plan: lookup → policy → refund  (1,204 tok)' },
      { meta: '10:42:08.012', tag: 'tool', kind: 'info', text: 'orders.lookup(id=4471)' },
      { meta: '10:42:08.240', tag: 'result', kind: 'ok', text: 'status=delivered amount=€129.00' },
      { meta: '10:42:09.101', tag: 'policy', kind: 'ok', text: 'refund_limit=€200  passed' },
      { meta: '10:42:09.530', tag: 'human', kind: 'warn', text: 'approval requested → ops@acme.example' },
      { meta: '10:42:31.877', tag: 'human', kind: 'ok', text: 'approved by ops@acme.example' },
      { meta: '10:42:32.004', tag: 'tool', kind: 'info', text: 'payments.refund(order=4471, €129.00)' },
      { meta: '10:42:32.310', tag: 'seal', kind: 'seal', text: 'chain sha256:9c1e…a07f  verified ✓' },
    ],
    problemTitle: 'When an agent gets it wrong, can you prove what happened?',
    problem:
      'Agents now refund orders, change records and email customers. Traces built for debugging get sampled, rotated and overwritten. When a customer, a regulator or your own team asks why the agent did that, you need a complete record nobody could have altered.',
    features: [
      {
        tag: 'replay',
        title: 'Replay any run',
        body: 'Step through a run exactly as it happened: inputs, model outputs, tool calls, retries and human approvals.',
      },
      {
        tag: 'integrity',
        title: 'Tamper-evident by design',
        body: 'Every event is hash-chained and sealed into write-once storage. Verify a run’s integrity with one click or one API call.',
      },
      {
        tag: 'capture',
        title: 'Drop-in capture',
        body: 'Python and TypeScript SDKs plus OpenTelemetry ingest. Wrap your agent loop — no rewrite, no new framework.',
      },
      {
        tag: 'evidence',
        title: 'Audit-ready exports',
        body: 'Export signed run histories for incident reviews, SOC 2 evidence and AI-regulation record-keeping.',
      },
    ],
    howTitle: 'Three lines to a complete record',
    steps: [
      'Install the SDK and wrap your agent’s entry point.',
      `Every step streams to ${BRAND}, hash-chained in order.`,
      'Search, replay and export runs — or verify the chain via API.',
    ],
    code: {
      file: 'agent.py',
      lang: 'python',
      source: `from ${BRAND} import Recorder

rec = Recorder(api_key="bl_live_…")

@rec.agent("support-agent")
def handle(ticket):
    # every llm call, tool call and approval
    # inside this run is recorded and sealed
    return agent.run(ticket)`,
    },
    finalTitle: 'Know exactly what your agents did.',
    finalBody:
      'We’re onboarding a small group of teams running agents in production. Join the waitlist for early access.',
    roles: ['AI / ML engineer', 'Backend / platform engineer', 'Security or compliance', 'Founder / CTO / eng lead', 'Other'],
    painQuestion: 'How do you debug or audit agent runs today?',
  },

  b: {
    label: 'Audit log API for SaaS',
    title: `${BRAND} — enterprise-ready audit logs for SaaS`,
    description:
      'One API call per event. A searchable, tamper-proof audit trail plus an embeddable log viewer for your customers.',
    eyebrow: 'For B2B SaaS teams moving upmarket',
    headline: { pre: 'Enterprise-ready ', em: 'audit logs', post: ' in an afternoon.' },
    lede: 'One API call per event. You get a searchable, tamper-proof audit trail — and an embeddable log viewer your customers’ security teams will actually use.',
    termTitle: 'audit · org_acme',
    term: [
      { meta: 'jane@acme.example', tag: 'role', kind: 'warn', text: 'user.role.updated  user_381 → admin' },
      { meta: 'api_key:ci-bot', tag: 'deploy', kind: 'info', text: 'deployment.created  env=production' },
      { meta: 'sam@acme.example', tag: 'sso', kind: 'warn', text: 'sso.config.changed  provider=okta' },
      { meta: 'jane@acme.example', tag: 'export', kind: 'info', text: 'report.exported  rows=12,480' },
      { meta: 'system', tag: 'auth', kind: 'err', text: 'login.failed  ip=203.0.113.24  attempts=5' },
      { meta: 'lee@acme.example', tag: 'billing', kind: 'info', text: 'invoice.refunded  inv_2291  $480.00' },
      { meta: 'system', tag: 'seal', kind: 'seal', text: 'batch 18,204 sealed  sha256:4be0…19cd ✓' },
    ],
    problemTitle: '“Do you have audit logs?” shouldn’t stall a deal.',
    problem:
      'It’s on every enterprise security questionnaire. Building it properly — immutable storage, retention, search, a customer-facing UI, SIEM export — takes weeks and never really ends. Most teams bolt it onto the main database and hope nobody asks follow-up questions.',
    features: [
      {
        tag: 'api',
        title: 'One API, any stack',
        body: 'Send structured events — actor, action, target, context — from any backend. Typed SDKs for TypeScript, Go and Python.',
      },
      {
        tag: 'embed',
        title: 'Embeddable viewer',
        body: 'Drop a filterable audit log into your app’s settings page. Scoped per customer and styled to match your product.',
      },
      {
        tag: 'stream',
        title: 'SIEM streaming',
        body: 'Let customers stream their own events to Splunk, Datadog, S3 or a webhook — without you building connectors.',
      },
      {
        tag: 'retain',
        title: 'Immutable & retained',
        body: 'Write-once storage, hash-chained events and per-plan retention that stands up in SOC 2 and ISO 27001 audits.',
      },
    ],
    howTitle: 'From zero to audit trail',
    steps: [
      'Call audit() wherever something important happens.',
      'Events are validated, chained and stored per tenant.',
      'Embed the viewer or give customers an export — done.',
    ],
    code: {
      file: 'refund.ts',
      lang: 'ts',
      source: `import { audit } from "@${BRAND}/node"

await audit({
  tenant: org.id,
  actor:  { id: user.id, email: user.email },
  action: "invoice.refunded",
  target: { type: "invoice", id: invoice.id },
  context: { ip: req.ip },
})`,
    },
    finalTitle: 'Check the box. Close the deal.',
    finalBody: 'We’re opening early access to a small group of SaaS teams. Join the waitlist to get in first.',
    roles: ['Backend / full-stack engineer', 'Engineering lead / CTO', 'Security or compliance', 'Product manager', 'Other'],
    painQuestion: 'How do you handle audit logs today?',
  },

  c: {
    label: 'All logs, one bundle',
    title: `${BRAND} — all your logs, one timeline`,
    description:
      'Stream logs from every service, container and function into a single timeline, correlated by trace and priced by what you keep.',
    eyebrow: 'For developers tired of grepping five dashboards',
    headline: { pre: 'All your logs. ', em: 'One bundle.', post: '' },
    lede: 'Stream logs from every service, container and function into a single timeline — correlated by trace, fast to search, and priced by what you actually keep.',
    termTitle: 'tail · trace=7b1f',
    term: [
      { meta: 'api-gateway', tag: 'INFO', kind: 'info', text: 'POST /v1/checkout 202 41ms' },
      { meta: 'orders', tag: 'INFO', kind: 'info', text: 'order ord_5510 created (3 items)' },
      { meta: 'inventory', tag: 'INFO', kind: 'ok', text: 'reserved sku_118 ×2, sku_907 ×1' },
      { meta: 'payments', tag: 'WARN', kind: 'warn', text: 'provider timeout, retry 1/3' },
      { meta: 'payments', tag: 'INFO', kind: 'ok', text: 'charge ch_83f1 succeeded' },
      { meta: 'mailer', tag: 'ERROR', kind: 'err', text: 'smtp 421 — queued for retry' },
      { meta: 'mailer', tag: 'INFO', kind: 'ok', text: 'receipt sent on retry 1' },
    ],
    problemTitle: 'Logs everywhere. Answers nowhere.',
    problem:
      'One request touches a gateway, three services, a queue and a worker. Their logs live in different places, with different formats and retention — and the bill for keeping them grows faster than your traffic.',
    features: [
      {
        tag: 'otel',
        title: 'OpenTelemetry-native',
        body: `Point any OTLP exporter, Fluent Bit or Vector at ${BRAND}. No proprietary agent to install.`,
      },
      {
        tag: 'trace',
        title: 'One request, one story',
        body: 'Logs from every service stitched together by trace ID, so you follow a request end to end.',
      },
      {
        tag: 'storage',
        title: 'Cheap to keep',
        body: 'Columnar storage on object storage keeps months of logs affordable. Hot and cold tiers, no reindexing.',
      },
      {
        tag: 'pricing',
        title: 'Predictable pricing',
        body: 'Pay for what you store — not per query or per seat. No surprise bill after a noisy deploy.',
      },
    ],
    howTitle: 'Two env vars and you’re in',
    steps: [
      `Point your OpenTelemetry exporter or log shipper at ${BRAND}.`,
      'Logs from every source land in one timeline, grouped by trace.',
      'Search, tail live and set alerts — from the browser or the CLI.',
    ],
    code: {
      file: '.env',
      lang: 'bash',
      source: `# works with any OpenTelemetry SDK or collector
OTEL_EXPORTER_OTLP_ENDPOINT=https://ingest.${DOMAIN}
OTEL_EXPORTER_OTLP_HEADERS="x-bl-key=bl_live_…"

# then, from your terminal
${BRAND} tail --trace 7b1f`,
    },
    finalTitle: 'Stop hunting. Read one timeline.',
    finalBody: 'We’re letting developers in in small batches. Join the waitlist to be first.',
    roles: ['Backend developer', 'DevOps / SRE / platform', 'Engineering lead / CTO', 'Indie hacker / solo founder', 'Other'],
    painQuestion: 'What do you use for logs today, and what bugs you about it?',
  },
}
