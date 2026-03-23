declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function getGtag() {
  if (typeof window === 'undefined') return undefined
  return (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
}
