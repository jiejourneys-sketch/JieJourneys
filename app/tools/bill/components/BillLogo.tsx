'use client'

import Image from 'next/image'

/** 整合進官網後，直接使用本專案 public/logo.jpg */
const LOGO_URL = '/logo.jpg'

export default function BillLogo() {
  return (
    <Image src={LOGO_URL} alt="旅杰分帳 Logo" width={34} height={34} style={{ objectFit: 'contain' }} />
  )
}
