'use client'

import Link from 'next/link'
import { useBuildBillPath } from './BillPathProvider'

type Props = Omit<React.ComponentProps<typeof Link>, 'href'> & {
  href: string
}

/** Link 會自動加上 basePath（/tools/bill），供 rewrite 情境使用 */
export default function BillLink({ href, ...rest }: Props) {
  const buildBillPath = useBuildBillPath()
  return <Link href={buildBillPath(href)} {...rest} />
}
