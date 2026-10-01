'use client'

import { useEffect, useState } from 'react'
import styles from './plannerRecovery.module.css'

const PLANNER_STORAGE_PREFIX = 'jiejourneys:tools-planner:'

type LocalPlannerDraft = {
  key: string
  label: string
  itemCount: number
  customPlaceCount: number
  noteCount: number
}

function readJson(value: string | null, fallback: unknown) {
  if (!value) return fallback
  try {
    return JSON.parse(value) as unknown
  } catch {
    return fallback
  }
}

function recordCount(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? Object.keys(value).length : 0
}

function draftLabel(key: string) {
  return key
    .slice(PLANNER_STORAGE_PREFIX.length)
    .replace(/:pass:v1$/, '（Pass）')
    .replace(/:v1$/, '')
}

export default function PlannerRecoveryPage() {
  const [drafts, setDrafts] = useState<LocalPlannerDraft[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const found: LocalPlannerDraft[] = []
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index)
        if (!key || !key.startsWith(PLANNER_STORAGE_PREFIX) || !key.endsWith(':v1')) continue
        const items = readJson(window.localStorage.getItem(key), [])
        if (!Array.isArray(items)) continue
        const customPlaces = readJson(window.localStorage.getItem(`${key}:custom-places`), {})
        const notes = readJson(window.localStorage.getItem(`${key}:notes`), {})
        found.push({
          key,
          label: draftLabel(key),
          itemCount: items.length,
          customPlaceCount: recordCount(customPlaces),
          noteCount: recordCount(notes),
        })
      }
      setDrafts(found.sort((left, right) => right.itemCount - left.itemCount))
      setReady(true)
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const downloadDraft = (draft: LocalPlannerDraft) => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      storageKey: draft.key,
      items: readJson(window.localStorage.getItem(draft.key), []),
      notes: readJson(window.localStorage.getItem(`${draft.key}:notes`), {}),
      customPlaces: readJson(window.localStorage.getItem(`${draft.key}:custom-places`), {}),
      userLinks: readJson(window.localStorage.getItem(`${draft.key}:user-links`), {}),
    }
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${draft.label.replace(/[^\w\u4e00-\u9fff-]+/g, '-')}-planner-backup.json`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>PLANNER RECOVERY</p>
        <h1>下載本機行程備份</h1>
        <p className={styles.lead}>
          此頁只會讀取目前瀏覽器的本機草稿，絕不會修改、儲存或刪除任何行程。
          請務必在原本新增行程的裝置與瀏覽器開啟。
        </p>

        {!ready ? <p className={styles.status}>正在讀取本機草稿…</p> : null}
        {ready && drafts.length === 0 ? (
          <p className={styles.empty}>
            這個瀏覽器沒有找到本機草稿。若你曾在另一台裝置、無痕模式或不同瀏覽器編輯，請改在原本的環境開啟此頁。
          </p>
        ) : null}

        {drafts.length > 0 ? (
          <div className={styles.list}>
            {drafts.map((draft) => (
              <article className={styles.draft} key={draft.key}>
                <div>
                  <h2>{draft.label}</h2>
                  <p>{draft.itemCount} 個行程項目・{draft.customPlaceCount} 個自訂地點・{draft.noteCount} 則筆記</p>
                </div>
                <button type="button" onClick={() => downloadDraft(draft)}>下載備份</button>
              </article>
            ))}
          </div>
        ) : null}

        <p className={styles.hint}>
          若看到義大利草稿超過 240 個項目，請先下載備份檔並傳給我；我會用它還原 10/11 與 10/12，保留目前行程內容。
        </p>
      </section>
    </main>
  )
}
