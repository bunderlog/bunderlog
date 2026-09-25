// The experiment's variants, shared by the page and the Worker (which has no DOM, so it can't import experiment.ts).
export const VARIANTS = ['a', 'b', 'c'] as const
export type Variant = (typeof VARIANTS)[number]

export const isVariant = (v: unknown): v is Variant => VARIANTS.includes(v as Variant)
