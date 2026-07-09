'use client'

import { useEffect, useState } from 'react'
import InAppBrowserGuard, {
  detectInAppBrowser,
} from '@/app/tools/bill/components/InAppBrowserGuard'
import { getShareUrl } from '@/lib/billPath'

export default function SharedBookInAppBrowserGuard({ bookId }: { bookId: string }) {
  const [open, setOpen] = useState(false)
  const promptKey = `jiejourneys:bill:shared-browser-prompt:${bookId}`

  useEffect(() => {
    if (!detectInAppBrowser()) return
    try {
      if (window.sessionStorage.getItem(promptKey) === '1') return
    } catch {
      // Show the reminder when session storage is unavailable.
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(true)
  }, [promptKey])

  const dismiss = () => {
    try {
      window.sessionStorage.setItem(promptKey, '1')
    } catch {
      // The reminder can still be dismissed without storage access.
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <InAppBrowserGuard
      variant="shared"
      copyUrl={getShareUrl(`/book/${bookId}`)}
      onContinue={dismiss}
      onClose={dismiss}
    />
  )
}
