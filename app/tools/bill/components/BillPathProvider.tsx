'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import {
  getBillBasePathFromLocation,
  buildBillPath as buildPath
} from '@/lib/billPath'

const BillPathContext = createContext<{
  basePath: string
  buildBillPath: (path: string) => string
}>({
  basePath: '',
  buildBillPath: (p) => (p.startsWith('/') ? p : `/${p}`)
})

type Props = {
  children: React.ReactNode
  /**
   * 讓 SSR 與 hydration 一致，避免 /tools/bill 下的連結 href 不一致。
   * 在本專案的路由結構中，Bill app 掛在 /tools/bill，因此預設為該 basePath。
   */
  initialBasePath?: string
}

export function BillPathProvider({ children, initialBasePath = '/tools/bill' }: Props) {
  const [basePath] = useState(() => {
    if (typeof window === 'undefined') return initialBasePath
    // client 仍允許依照實際 host/pathname 推導，但會與 initialBasePath 保持一致（/tools/bill 頁面）
    const inferred = getBillBasePathFromLocation(window.location.host, window.location.pathname)
    return inferred || initialBasePath
  })

  const value = useMemo(
    () => ({
      basePath,
      buildBillPath: (path: string) => buildPath(basePath, path)
    }),
    [basePath]
  )

  return (
    <BillPathContext.Provider value={value}>{children}</BillPathContext.Provider>
  )
}

export function useBillBasePath(): string {
  return useContext(BillPathContext).basePath
}

export function useBuildBillPath(): (path: string) => string {
  return useContext(BillPathContext).buildBillPath
}
