'use client'

import { useState } from 'react'
import ChangeLogBanner from './ChangeLogBanner'
import ChangeLogModal from './ChangeLogModal'

export default function ChangeLogSection({ bookId }: { bookId: string }) {
  const [modalOpen, setModalOpen] = useState(false)
  return (
    <>
      <ChangeLogBanner bookId={bookId} onOpenModal={() => setModalOpen(true)} />
      {modalOpen && <ChangeLogModal bookId={bookId} onClose={() => setModalOpen(false)} />}
    </>
  )
}
