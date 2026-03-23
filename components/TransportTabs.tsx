'use client'

import { useState } from 'react'
import { getGtag } from '@/lib/gtag'

export type TransportTab = 'all' | 'sim' | 'transport'

const TAB_CONFIG: { value: TransportTab; label: string; dataArea: string }[] = [
  { value: 'all', label: '全部', dataArea: 'all' },
  { value: 'sim', label: '通訊', dataArea: '通訊' },
  { value: 'transport', label: '交通', dataArea: '交通' },
]

type Props = {
  activeTab: TransportTab
  onTabChange: (tab: TransportTab) => void
}

export default function TransportTabs({ activeTab, onTabChange }: Props) {
  const handleClick = (tab: TransportTab) => {
    onTabChange(tab)
    const fn = getGtag()
    if (typeof fn === 'function') {
      fn('event', 'transport_tab_click', {
        tab,
        page_path: typeof window !== 'undefined' ? location.pathname : '',
      })
    }
  }

  return (
    <div className="tabs" id="areaTabs">
      {TAB_CONFIG.map(({ value, label, dataArea }) => (
        <button
          key={value}
          type="button"
          className={`tab ${activeTab === value ? 'active' : ''}`}
          data-area={dataArea}
          onClick={() => handleClick(value)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
