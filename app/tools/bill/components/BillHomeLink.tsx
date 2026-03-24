'use client'

import Link from 'next/link'
import { useBuildBillPath } from './BillPathProvider'

type Props = Omit<React.ComponentProps<typeof Link>, 'href'>

export default function BillHomeLink(props: Props) {
  const { children, ...rest } = props
  const buildBillPath = useBuildBillPath()
  return <Link href={buildBillPath('/')} {...rest}>{children}</Link>
}
