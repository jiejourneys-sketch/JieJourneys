'use client'

/** 整合進官網後，直接使用本專案 public/logo.jpg */
const LOGO_URL = '/logo.jpg'

export default function BillLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LOGO_URL} alt="" width={34} height={34} style={{ objectFit: 'contain' }} />
  )
}
