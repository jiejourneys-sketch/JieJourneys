'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './plannerImages.module.css'

type PlannerImage = {
  id: string
  placeId: string
  url: string
  width: number
  height: number
  createdAt: string
}

type ImageResponse = {
  images?: PlannerImage[]
  error?: string
}

const READ_TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,64}$/

function imageEndpoint() {
  const base = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL?.replace(/\/$/, '')
  return base ? `${base}/functions/v1/planner-images` : ''
}

function requestHeaders(readToken: string) {
  const anonKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY ?? ''
  return {
    'x-planner-read-token': readToken,
    ...(anonKey ? { apikey: anonKey, Authorization: `Bearer ${anonKey}` } : {}),
  }
}

function tokenFromHash() {
  const raw = window.location.hash.replace(/^#/, '')
  const value = raw.startsWith('v=') ? raw.slice(2) : raw
  try {
    return decodeURIComponent(value).trim()
  } catch {
    return ''
  }
}

export default function PlannerImageViewerClient() {
  const [readToken, setReadToken] = useState('')
  const [images, setImages] = useState<PlannerImage[]>([])
  const [index, setIndex] = useState(0)
  const [busy, setBusy] = useState(true)
  const [error, setError] = useState('')

  const loadImages = useCallback(async (token: string, keepPosition = false) => {
    const endpoint = imageEndpoint()
    if (!endpoint) {
      setError('圖片服務尚未完成設定。')
      setBusy(false)
      return
    }
    if (!READ_TOKEN_PATTERN.test(token)) {
      setImages([])
      setError(token ? '這個照片網址不正確。' : '這個網址缺少 Planner 的查看代碼。')
      setBusy(false)
      return
    }

    setBusy(true)
    setError('')
    try {
      const response = await fetch(endpoint, {
        headers: requestHeaders(token),
        cache: 'no-store',
      })
      const payload = (await response.json().catch(() => null)) as ImageResponse | null
      if (!response.ok || !payload || !Array.isArray(payload.images)) {
        setImages([])
        setError(response.status === 404
          ? '找不到這份 Planner，可能已過期或網址不完整。'
          : '暫時無法讀取照片，請稍後再試。')
        return
      }

      setImages(payload.images)
      setIndex((current) => keepPosition ? Math.min(current, Math.max(payload.images!.length - 1, 0)) : 0)
    } catch {
      setImages([])
      setError('連線失敗，請稍後再試。')
    } finally {
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    const readFromAddress = () => {
      const token = tokenFromHash()
      setReadToken(token)
      void loadImages(token)
    }

    readFromAddress()
    window.addEventListener('hashchange', readFromAddress)
    return () => window.removeEventListener('hashchange', readFromAddress)
  }, [loadImages])

  const image = images[index] ?? null
  const canGoBack = index > 0 && !busy
  const canGoForward = index + 1 < images.length && !busy

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>PLANNER PHOTOS</p>
            <h1>Planner 照片</h1>
            <p className={styles.publicNote}>此頁為唯讀檢視；每次只顯示一張照片，可用上一張、下一張瀏覽。</p>
          </div>
        </header>

        <div className={styles.publicActions}>
          <button
            className={styles.refreshButton}
            disabled={busy || !readToken}
            onClick={() => void loadImages(readToken, true)}
            type="button"
          >
            {busy ? '更新中…' : '重新整理照片'}
          </button>
        </div>

        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        {!error && !busy && images.length === 0 ? (
          <p className={styles.empty}>這份 Planner 目前沒有照片。</p>
        ) : null}

        {image ? (
          <div className={styles.viewer} aria-busy={busy}>
            <div className={styles.navigation}>
              <button disabled={!canGoBack} type="button" onClick={() => setIndex((value) => value - 1)}>← 上一張</button>
              <strong aria-live="polite">第 {index + 1} / {images.length} 張</strong>
              <button disabled={!canGoForward} type="button" onClick={() => setIndex((value) => value + 1)}>下一張 →</button>
            </div>

            <a
              className={`${styles.imageStage} ${busy ? styles.loading : ''}`}
              href={image.url}
              rel="noreferrer"
              target="_blank"
              title="在新分頁開啟原圖"
            >
              {/* The private signed URL is used directly, so no duplicate optimized copy is stored. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Planner 照片 ${index + 1}`}
                height={image.height}
                key={image.id}
                src={image.url}
                width={image.width}
              />
              {busy ? <span className={styles.loadingLabel}>更新中…</span> : null}
            </a>
            <p className={styles.publicStatus}>新增或移除照片後，按「重新整理照片」即可看到最新內容。</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}
