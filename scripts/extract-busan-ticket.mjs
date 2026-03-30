import fs from 'fs'

const s = fs.readFileSync('app/busan/ticket/page.tsx', 'utf8')
const tabsMatch = s.match(/tabs=\{(\[[\s\S]*?\])\}\s*\n\s*cards=\{/)
if (!tabsMatch) throw new Error('tabs not found')
const cardsMatch = s.match(/cards=\{(\[[\s\S]*?\])\}\s*\n\s*tabEvent=/)
if (!cardsMatch) throw new Error('cards not found')

const header = `import type { TabItem } from '@/components/AreaTabs'
import type { CityCard } from '@/components/CityTabbedList'

export const busanTicketTabs: TabItem[] = ${tabsMatch[1]}

export const busanTicketCards = ${cardsMatch[1]} satisfies CityCard[]
`

fs.writeFileSync('data/busanTicketCards.ts', header, 'utf8')
console.log('OK', header.length)
