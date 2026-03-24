'use client'

/** Logo 一律從 bill 子網域載入，避免 rewrite 情境下 /logo.jpg 404 */
const LOGO_URL = 'https://bill.jiejourneys.com/logo.jpg'

export default function BillLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={LOGO_URL} alt="" width={34} height={34} style={{ objectFit: 'contain' }} />
  )
}
