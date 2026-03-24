'use client'

import { getGtag } from '@/lib/gtag'

export type TabItem = { value: string; label: string; dataArea: string }

type Props = {
  tabs: TabItem[]
  activeTab: string
  onTabChange: (value: string) => void
  gtagEvent?: string
  showActive?: boolean
}

export default function AreaTabs({
  tabs,
  activeTab,
  onTabChange,
  gtagEvent,
  showActive = true,
}: Props) {
  const handleClick = (value: string) => {
    onTabChange(value)
    const fn = getGtag()
    if (typeof fn === 'function' && gtagEvent) {
      fn('event', gtagEvent, {
        area: value,
        page_path: typeof window !== 'undefined' ? location.pathname : '',
      })
    }
  }

  return (
    <div className="tabs" id="areaTabs">
      {tabs.map(({ value, label, dataArea }) => (
        <button
          key={value}
          type="button"
          className={`tab ${showActive && activeTab === value ? 'active' : ''}`}
          data-area={dataArea}
          onClick={() => handleClick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
