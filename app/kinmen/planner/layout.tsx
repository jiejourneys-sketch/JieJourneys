import type { Metadata } from 'next'

const title = '金門景點排序工具'
const description = '私人測試用的金門景點排序工具。'

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function KinmenPlannerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
