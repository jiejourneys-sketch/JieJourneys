/**
 * 分帳路徑 helper：支援 rewrite 情境（jiejourneys.com/tools/bill）
 * - bill.jiejourneys.com 直開：basePath = ''
 * - jiejourneys.com/tools/bill：basePath = '/tools/bill'
 */

/** 取得 base path，純函式（需傳入 host 與 pathname，供 client 使用） */
export function getBillBasePathFromLocation(host: string, pathname: string): string {
  if (typeof host !== 'string' || typeof pathname !== 'string') return ''
  const isMainSite = host.includes('jiejourneys.com') && !host.includes('bill.')
  const isUnderToolsBill = pathname.startsWith('/tools/bill')
  return isMainSite || isUnderToolsBill ? '/tools/bill' : ''
}

/** Client: 從 window 取得 base path */
export function getBillBasePath(): string {
  if (typeof window === 'undefined') return ''
  return getBillBasePathFromLocation(window.location.host, window.location.pathname)
}

/** 組合完整路徑，path 必須以 / 開頭 */
export function buildBillPath(basePath: string, path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return basePath ? `${basePath}${p}` : p
}

/** 分享連結：一律使用主站 URL https://jiejourneys.com/tools/bill/... */
export const SHARE_URL_BASE = 'https://jiejourneys.com/tools/bill'

/** 取得分享用完整 URL（path 如 /book/123，不含 /tools/bill 前綴） */
export function getShareUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${SHARE_URL_BASE}${p}`
}

/** 從 pathname 取得 canonical path（去掉 /tools/bill 前綴） */
export function getCanonicalPathFromPathname(pathname: string): string {
  return pathname.replace(/^\/tools\/bill/, '') || '/'
}
