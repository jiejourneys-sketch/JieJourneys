'use client'

import { useEffect, useState } from 'react'

type InApp = 'instagram' | 'line' | 'messenger' | 'facebook'
type GuardVariant = 'create' | 'shared'

export function detectInAppBrowser(): InApp | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/Line\//i.test(ua)) return 'line'
  if (/Messenger|FBAN\/MessengerForiOS/i.test(ua)) return 'messenger'
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook'
  return null
}

function inAppBrowserName(browser: InApp) {
  if (browser === 'instagram') return 'IG'
  if (browser === 'line') return 'LINE'
  if (browser === 'messenger') return 'Messenger'
  return 'Facebook'
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function openInSystemBrowser() {
  const url = new URL(window.location.href)
  url.searchParams.set('openExternalBrowser', '1')
  window.location.href = url.toString()
}

export default function InAppBrowserGuard({
  onContinue,
  onClose,
  variant = 'create',
  copyUrl,
}: {
  onContinue: () => void
  onClose: () => void
  variant?: GuardVariant
  copyUrl?: string
}) {
  const [browser, setBrowser] = useState<InApp | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowser(detectInAppBrowser())
  }, [])

  if (!browser) return null

  const browserName = isIOS() ? 'Safari' : 'Chrome'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyUrl ?? window.location.href)
      setCopied(true)
    } catch { /* noop */ }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        background: '#fff',
        width: '100%',
        borderRadius: '20px 20px 0 0',
        padding: '28px 24px 48px',
        textAlign: 'center',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            fontSize: '1.2rem', color: '#9ca3af', cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ✕
        </button>

        <div style={{ fontSize: '1.8rem', marginBottom: 12 }}>📱</div>

        <p style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1f2937', marginBottom: 8 }}>
          建議先切換到 {browserName}
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: 24 }}>
          {variant === 'shared'
            ? `你現在透過 ${inAppBrowserName(browser)} 內建瀏覽器查看分享帳本。建議複製完整連結，再到 ${browserName} 開啟。`
            : '這樣下次才找得到你的帳本 ✓'}
        </p>

        {variant === 'create' && browser === 'line' ? (
          <button
            onClick={openInSystemBrowser}
            style={{
              width: '100%', padding: '13px',
              background: '#1f7a8c', color: '#fff',
              border: 'none', borderRadius: 12,
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              marginBottom: 10,
            }}
          >
            在 {browserName} 開啟 →
          </button>
        ) : copied ? (
          <div style={{
            background: '#f0fdf4', border: '1.5px solid #16a34a',
            borderRadius: 12, padding: '14px 16px', marginBottom: 10,
          }}>
            <p style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>
              ✓ 連結已複製
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.82rem' }}>
              請開啟 {browserName}，貼上網址即可
            </p>
          </div>
        ) : (
          <button
            onClick={handleCopy}
            style={{
              width: '100%', padding: '13px',
              background: '#1f7a8c', color: '#fff',
              border: 'none', borderRadius: 12,
              fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer',
              marginBottom: 10,
            }}
          >
            複製連結，去 {browserName} 開啟
          </button>
        )}

        <button
          onClick={onContinue}
          style={{
            width: '100%', padding: '11px',
            background: 'none', color: '#9ca3af',
            border: '1px solid #e5e7eb', borderRadius: 12,
            fontSize: '0.85rem', cursor: 'pointer',
          }}
        >
          {variant === 'shared' ? '繼續在這裡查看' : '繼續在這裡建立'}
        </button>
      </div>
    </div>
  )
}
