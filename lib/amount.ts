/** 金額以 cents（分）存儲，1 元 = 100 cents */
import { getCurrencySymbol } from './currency'

/** 使用者輸入的金額（元）→ 存儲用 cents */
export function toCents(value: number | string): number {
  const n = typeof value === 'string' ? parseFloat(value) || 0 : value
  return Math.round(n * 100)
}

/** 存儲的 cents → 顯示用（可帶小數） */
export function fromCents(cents: number): number {
  return cents / 100
}

/** 格式化顯示：整數不顯示 .00，有小數才顯示 */
export function formatCents(cents: number): string {
  const n = fromCents(cents)
  return n % 1 === 0 ? String(Math.round(n)) : n.toFixed(2)
}

/** 格式化顯示，帶貨幣符號：e.g. NT$3,000 / ¥5,000 */
export function formatWithCurrency(cents: number, currency: string): string {
  return `${getCurrencySymbol(currency)}${formatCents(cents)}`
}
