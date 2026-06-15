export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>

export function safePlannerReturnHref(value: string | string[] | undefined, fallbackHref: string) {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return fallbackHref
  return raw
}
