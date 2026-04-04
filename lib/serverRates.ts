/**
 * Server-side utility: 取得帳本實際使用的匯率。
 * 優先用帳本儲存的 exchange_rates（使用者手動設定），
 * 其餘幣別自動從外部 API 補上（24hr cache）。
 */
export async function resolveExchangeRates(
  baseCurrency: string,
  storedRates: Record<string, number>
): Promise<Record<string, number>> {
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`, {
      next: { revalidate: 86400 }
    })
    if (!res.ok) return storedRates
    const data = await res.json() as { result: string; rates: Record<string, number> }
    if (data.result !== 'success') return storedRates

    // open.er-api 回傳 1 base = X 外幣 → 反轉成 1 外幣 = X base
    const liveRates: Record<string, number> = {}
    for (const [code, rate] of Object.entries(data.rates)) {
      if (code !== baseCurrency && rate > 0) {
        liveRates[code] = 1 / rate
      }
    }
    // 使用者手動設定的匯率優先於即時匯率
    return { ...liveRates, ...storedRates }
  } catch {
    return storedRates
  }
}
