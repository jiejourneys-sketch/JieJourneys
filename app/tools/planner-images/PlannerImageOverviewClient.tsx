'use client'

import { FormEvent, useState } from 'react'
import styles from './plannerImages.module.css'

type PlannerImage = {
  id: string
  bookId: string
  placeId: string
  storagePath: string
  width: number
  height: number
  bytes: number
  createdAt: string
  deletedAt: string | null
  plannerUrl: string | null
  url: string
}

type OverviewResponse = {
  image?: PlannerImage | null
  index?: number
  total?: number
  error?: string
}

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: '管理密碼不正確。',
  server_not_configured: '圖片檢視器尚未完成伺服器設定。',
  invalid_index: '照片頁碼不正確。',
  invalid_image_id: '照片連結不正確。',
  invalid_book_id: 'Planner 照片連結不正確。',
  image_not_found: '這張照片已不存在。',
  out_of_range: '這張照片已不存在，請回到上一張。',
  load_failed: '暫時無法讀取照片資料。',
  sign_failed: '暫時無法建立照片檢視網址。',
  request_failed: '連線失敗，請稍後再試。',
}

function overviewEndpoint(index: number, imageId = '', bookId = '') {
  const base = process.env.NEXT_PUBLIC_TRIP_SUPABASE_URL?.replace(/\/$/, '')
  if (!base) return ''
  const url = new URL(`${base}/functions/v1/planner-image-overview`)
  url.searchParams.set('index', String(index))
  if (imageId) url.searchParams.set('image', imageId)
  if (bookId) url.searchParams.set('book', bookId)
  return url.toString()
}

function requestedImageId() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('image')?.trim() ?? ''
}

function requestedBookId() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('book')?.trim() ?? ''
}

function imageViewerUrl(imageId: string, bookId = requestedBookId()) {
  const search = new URLSearchParams({ image: imageId })
  if (bookId) search.set('book', bookId)
  return `https://www.jiejourneys.com/tools/planner-images?${search.toString()}`
}

function requestHeaders(adminToken: string) {
  const anonKey = process.env.NEXT_PUBLIC_TRIP_SUPABASE_ANON_KEY ?? ''
  return {
    'x-planner-admin-token': adminToken,
    ...(anonKey ? { apikey: anonKey, Authorization: `Bearer ${anonKey}` } : {}),
  }
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(bytes >= 102_400 ? 0 : 1)} KB`
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value || '—'
  return new Intl.DateTimeFormat('zh-TW', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Taipei',
  }).format(date)
}

export default function PlannerImageOverviewClient() {
  const [password, setPassword] = useState('')
  const [adminToken, setAdminToken] = useState('')
  const [image, setImage] = useState<PlannerImage | null>(null)
  const [index, setIndex] = useState(0)
  const [total, setTotal] = useState(0)
  const [authorized, setAuthorized] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [copiedLink, setCopiedLink] = useState<'image' | 'planner' | ''>('')

  const loadImage = async (targetIndex: number, token = adminToken, imageId = '') => {
    const bookId = requestedBookId()
    const endpoint = overviewEndpoint(targetIndex, imageId, bookId)
    if (!endpoint) {
      setError('缺少 Supabase 網址設定。')
      return
    }

    setBusy(true)
    setError('')
    try {
      const response = await fetch(endpoint, {
        headers: requestHeaders(token),
        cache: 'no-store',
      })
      const payload = (await response.json().catch(() => null)) as OverviewResponse | null
      if (!response.ok || !payload) {
        const code = payload?.error ?? 'request_failed'
        if (response.status === 401) {
          setAuthorized(false)
          setAdminToken('')
        }
        setError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES.request_failed)
        return
      }

      setAuthorized(true)
      setAdminToken(token)
      setImage(payload.image ?? null)
      setIndex(typeof payload.index === 'number' ? payload.index : targetIndex)
      setTotal(typeof payload.total === 'number' ? payload.total : 0)
      if (payload.image?.id) {
        const search = new URLSearchParams({ image: payload.image.id })
        if (bookId) search.set('book', bookId)
        window.history.replaceState(window.history.state, '', `/tools/planner-images?${search.toString()}`)
      }
    } catch {
      setError(ERROR_MESSAGES.request_failed)
    } finally {
      setBusy(false)
    }
  }

  const unlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const token = password.trim()
    if (!token) {
      setError('請輸入管理密碼。')
      return
    }
    await loadImage(0, token, requestedImageId())
  }

  const lock = () => {
    setAuthorized(false)
    setAdminToken('')
    setPassword('')
    setImage(null)
    setIndex(0)
    setTotal(0)
    setCopiedLink('')
    setError('')
  }

  const copyLink = async (kind: 'image' | 'planner', value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedLink(kind)
      window.setTimeout(() => setCopiedLink((current) => current === kind ? '' : current), 1800)
    } catch {
      setError('瀏覽器無法自動複製，請選取網址後手動複製。')
    }
  }

  const canGoBack = authorized && index > 0 && !busy
  const canGoForward = authorized && index + 1 < total && !busy

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>PLANNER IMAGE OVERVIEW</p>
            <h1>Planner 圖片檢視器</h1>
            <p className={styles.lead}>每次只載入一張原圖，不另外建立縮圖，也不增加 Storage 容量。</p>
          </div>
          {authorized ? (
            <button className={styles.lockButton} type="button" onClick={lock}>鎖定</button>
          ) : null}
        </header>

        {!authorized ? (
          <form className={styles.loginForm} onSubmit={unlock}>
            <label htmlFor="planner-image-admin-password">管理密碼</label>
            <div className={styles.loginRow}>
              <input
                autoComplete="current-password"
                id="planner-image-admin-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="輸入圖片檢視密碼"
                type="password"
                value={password}
              />
              <button disabled={busy} type="submit">{busy ? '讀取中…' : '查看照片'}</button>
            </div>
            <p className={styles.securityHint}>密碼只保留在目前頁面，重新整理後需要再次輸入。</p>
          </form>
        ) : null}

        {error ? <p className={styles.error} role="alert">{error}</p> : null}

        {authorized && total === 0 ? (
          <p className={styles.empty}>目前沒有任何 Planner 照片。</p>
        ) : null}

        {authorized && image ? (
          <div className={styles.viewer} aria-busy={busy}>
            <div className={styles.navigation}>
              <button disabled={!canGoBack} type="button" onClick={() => loadImage(index - 1)}>← 上一張</button>
              <strong aria-live="polite">第 {index + 1} / {total} 張</strong>
              <button disabled={!canGoForward} type="button" onClick={() => loadImage(index + 1)}>下一張 →</button>
            </div>

            <a
              className={`${styles.imageStage} ${busy ? styles.loading : ''}`}
              href={image.url}
              rel="noreferrer"
              target="_blank"
              title="在新分頁開啟原圖"
            >
              {/* The private signed URL should be loaded directly, without a second image optimizer. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Planner ${image.bookId} 的照片`}
                height={image.height}
                key={image.id}
                src={image.url}
                width={image.width}
              />
              {busy ? <span className={styles.loadingLabel}>讀取中…</span> : null}
            </a>

            <dl className={styles.details}>
              <div className={styles.linkRow}>
                <dt>圖片檢視網址</dt>
                <dd>
                  <input aria-label="圖片檢視網址" readOnly value={imageViewerUrl(image.id)} />
                  <span className={styles.linkActions}>
                    <a href={imageViewerUrl(image.id)} rel="noreferrer" target="_blank">開啟</a>
                    <button type="button" onClick={() => void copyLink('image', imageViewerUrl(image.id))}>
                      {copiedLink === 'image' ? '已複製' : '複製'}
                    </button>
                  </span>
                </dd>
              </div>
              <div className={styles.linkRow}>
                <dt>Planner 網址</dt>
                <dd>
                  {image.plannerUrl ? (
                    <>
                      <input aria-label="Planner 網址" readOnly value={image.plannerUrl} />
                      <span className={styles.linkActions}>
                        <a href={image.plannerUrl} rel="noreferrer" target="_blank">開啟</a>
                        <button type="button" onClick={() => void copyLink('planner', image.plannerUrl!)}>
                          {copiedLink === 'planner' ? '已複製' : '複製'}
                        </button>
                      </span>
                    </>
                  ) : '此 Planner 沒有可用連結'}
                </dd>
              </div>
              <div><dt>Book ID</dt><dd>{image.bookId}</dd></div>
              <div><dt>Place ID</dt><dd>{image.placeId}</dd></div>
              <div><dt>建立時間</dt><dd>{formatDate(image.createdAt)}</dd></div>
              <div><dt>圖片大小</dt><dd>{image.width} × {image.height}・{formatBytes(image.bytes)}</dd></div>
              <div><dt>狀態</dt><dd>{image.deletedAt ? '已從來源行程移除（仍被副本使用）' : '使用中'}</dd></div>
              <div className={styles.pathRow}><dt>Storage path</dt><dd>{image.storagePath}</dd></div>
            </dl>
          </div>
        ) : null}
      </section>
    </main>
  )
}
