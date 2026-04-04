export interface CurrencyInfo {
  code: string
  symbol: string
  name: string
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'TWD', symbol: 'NT$', name: '台幣' },
  { code: 'JPY', symbol: '¥', name: '日圓' },
  { code: 'KRW', symbol: '₩', name: '韓元' },
  { code: 'VND', symbol: '₫', name: '越南盾' },
  { code: 'USD', symbol: '$', name: '美金' },
  { code: 'HKD', symbol: 'HK$', name: '港幣' },
  { code: 'EUR', symbol: '€', name: '歐元' },
  { code: 'THB', symbol: '฿', name: '泰銖' },
  { code: 'SGD', symbol: 'S$', name: '新幣' },
  { code: 'MYR', symbol: 'RM', name: '馬幣' },
  { code: 'PHP', symbol: '₱', name: '菲幣' },
  { code: 'IDR', symbol: 'Rp', name: '印尼盾' },
  { code: 'AUD', symbol: 'A$', name: '澳幣' },
]

const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]))

export function getCurrencySymbol(code: string): string {
  return CURRENCY_MAP.get(code)?.symbol ?? code
}

export type ExchangeRates = Record<string, number>

/**
 * Convert cents from one currency to another.
 * rates: { JPY: 0.22 } means 1 JPY = 0.22 baseCurrency
 * Returns NaN if conversion is impossible (missing rate).
 */
export function convertCents(
  cents: number,
  fromCurrency: string,
  toCurrency: string,
  baseCurrency: string,
  rates: ExchangeRates
): number {
  if (fromCurrency === toCurrency) return cents

  // Step 1: convert to base currency cents
  let baseCents: number
  if (fromCurrency === baseCurrency) {
    baseCents = cents
  } else {
    const rate = rates[fromCurrency]
    if (!rate) return NaN
    baseCents = Math.round(cents * rate)
  }

  // Step 2: convert from base to target
  if (toCurrency === baseCurrency) return baseCents
  const targetRate = rates[toCurrency]
  if (!targetRate) return NaN
  return Math.round(baseCents / targetRate)
}

export const LAST_CURRENCY_STORAGE_KEY = 'bill:lastCurrency'
