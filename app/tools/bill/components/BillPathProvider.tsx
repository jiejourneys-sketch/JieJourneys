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

export function BillPathProvider({ children }: { children: React.ReactNode }) {
  const [basePath] = useState(() =>
    typeof window !== 'undefined'
      ? getBillBasePathFromLocation(window.location.host, window.location.pathname)
      : ''
  )

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
