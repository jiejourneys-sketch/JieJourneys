/**
 * 結算邏輯：各自結清（最少轉帳） vs 集中結算（主揪）
 * 兩套完全不同的演算法，結果不同。
 */

export type BalanceRow = {
  id: string
  name: string
  paid: number
  share: number
  balance: number
}

export type SettlementRow = {
  fromId: string
  fromName: string
  toId: string
  toName: string
  amount: number
}

const EPSILON = 1

/**
 * 各自結清（最少轉帳）
 * - Greedy 配對：debtor ↔ creditor 直接配對
 * - 不會出現中間人（A → B → C）
 * - 每筆都是 debtor → creditor
 * - 轉帳筆數最少
 */
export function computeMinTransactions(balances: BalanceRow[]): SettlementRow[] {
  const settlements: SettlementRow[] = []

  const cmpCred = (a: { id: string; balance: number }, b: { id: string; balance: number }) => {
    const diff = b.balance - a.balance
    if (Math.abs(diff) <= EPSILON) return a.id.localeCompare(b.id)
    return diff
  }
  const cmpDebt = (a: { id: string; balance: number }, b: { id: string; balance: number }) => {
    const diff = b.balance - a.balance
    if (Math.abs(diff) <= EPSILON) return a.id.localeCompare(b.id)
    return diff
  }

  const creditors = balances
    .filter((b) => b.balance > EPSILON)
    .map((b) => ({ ...b }))
    .sort(cmpCred)
  const debtors = balances
    .filter((b) => b.balance < -EPSILON)
    .map((b) => ({ id: b.id, name: b.name, balance: -b.balance }))
    .sort(cmpDebt)

  let i = 0
  let j = 0
  while (i < debtors.length && j < creditors.length) {
    const d = debtors[i]
    const c = creditors[j]
    const amount = Math.min(d.balance, c.balance)
    if (amount >= 1) {
      settlements.push({
        fromId: d.id,
        fromName: d.name,
        toId: c.id,
        toName: c.name,
        amount: Math.round(amount)
      })
    }
    d.balance -= amount
    c.balance -= amount
    if (d.balance < 1) i++
    if (c.balance < 1) j++
  }

  return settlements
}

/**
 * 集中結算（主揪）
 * - 兩階段：1. 所有 debtor → collector  2. collector → 其他 creditor
 * - 一定有中間人（主揪）
 * - 一定會出現「collector → 其他人」的交易
 */
export function computeCentralizedSettlement(balances: BalanceRow[]): SettlementRow[] {
  const settlements: SettlementRow[] = []

  const cmpCred = (a: { id: string; balance: number }, b: { id: string; balance: number }) => {
    const diff = b.balance - a.balance
    if (Math.abs(diff) <= EPSILON) return a.id.localeCompare(b.id)
    return diff
  }
  const cmpDebt = (a: { id: string; balance: number }, b: { id: string; balance: number }) => {
    const diff = b.balance - a.balance
    if (Math.abs(diff) <= EPSILON) return a.id.localeCompare(b.id)
    return diff
  }

  const creditors = balances
    .filter((b) => b.balance > EPSILON)
    .map((b) => ({ ...b }))
    .sort(cmpCred)
  const debtors = balances
    .filter((b) => b.balance < -EPSILON)
    .map((b) => ({ id: b.id, name: b.name, balance: -b.balance }))
    .sort(cmpDebt)

  const collector = creditors.length
    ? creditors.reduce((best, c) => (c.balance > best.balance ? c : best))
    : null

  if (!collector) return settlements

  // Step 1: 所有 debtor → 主揪
  for (const d of debtors) {
    if (d.balance >= 1) {
      settlements.push({
        fromId: d.id,
        fromName: d.name,
        toId: collector.id,
        toName: collector.name,
        amount: Math.round(d.balance)
      })
    }
  }

  // Step 2: 主揪 → 其他 creditor（不包含自己）
  const otherCreditors = creditors.filter((c) => c.id !== collector.id)
  for (const c of otherCreditors) {
    if (c.balance >= 1) {
      settlements.push({
        fromId: collector.id,
        fromName: collector.name,
        toId: c.id,
        toName: c.name,
        amount: Math.round(c.balance)
      })
    }
  }

  return settlements
}

/**
 * 驗證結算邏輯：測試資料 A+800 B+400 C-400 D-800
 * 各自結清：C→B 400, D→A 800
 * 集中結算：C→A 400, D→A 800, A→B 400
 */
export function verifySettlementLogic(): boolean {
  const balances: BalanceRow[] = [
    { id: 'a', name: 'A', paid: 0, share: 0, balance: 800 },
    { id: 'b', name: 'B', paid: 0, share: 0, balance: 400 },
    { id: 'c', name: 'C', paid: 0, share: 0, balance: -400 },
    { id: 'd', name: 'D', paid: 0, share: 0, balance: -800 }
  ]
  const min = computeMinTransactions(balances)
  const cen = computeCentralizedSettlement(balances)

  const minOk =
    min.length === 2 &&
    min.some((s) => s.fromId === 'c' && s.toId === 'b' && s.amount === 400) &&
    min.some((s) => s.fromId === 'd' && s.toId === 'a' && s.amount === 800)

  const cenOk =
    cen.length === 3 &&
    cen.some((s) => s.fromId === 'c' && s.toId === 'a' && s.amount === 400) &&
    cen.some((s) => s.fromId === 'd' && s.toId === 'a' && s.amount === 800) &&
    cen.some((s) => s.fromId === 'a' && s.toId === 'b' && s.amount === 400)

  const sameWouldBeWrong = JSON.stringify(min) !== JSON.stringify(cen)
  return minOk && cenOk && sameWouldBeWrong
}
