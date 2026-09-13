'use client'

type Props = {
  title: string
  tags: string
  href: string
  event: string
  section: string
  promoCode?: string
  onCopied?: (promoCode: string) => void
}

async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    try {
      document.execCommand('copy')
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

export default function PromoResourceCard({ title, tags, href, event, section, promoCode, onCopied }: Props) {
  const handleCopy = async () => {
    if (!promoCode) return
    await copyToClipboard(promoCode)
    onCopied?.(promoCode)
  }

  return (
    <article className="promo-resource-card" data-item="tool" data-section={section} data-tags={tags}>
      <h3>{title}</h3>
      <div className="promo-resource-actions">
        {promoCode ? (
          <button
            type="button"
            className="promo-resource-copy"
            onClick={handleCopy}
            data-event={`${event}_copy`}
            data-item="tool"
            data-section={section}
          >
            優惠碼
          </button>
        ) : null}
        <a
          href={href}
          className="promo-resource-visit"
          target="_blank"
          rel="noopener noreferrer"
          data-event={event}
          data-item="tool"
          data-section={section}
          data-tags={tags}
        >
          前往網站
        </a>
      </div>
    </article>
  )
}
