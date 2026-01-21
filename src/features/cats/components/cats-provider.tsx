/* eslint-disable react-refresh/only-export-components */

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Cat } from '../data/schema'

type CatsDialogType = 'create' | 'edit' | 'delete'

type CatsContextType = {
  open: CatsDialogType | null
  setOpen: (str: CatsDialogType | null) => void
  currentRow: Cat | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Cat | null>>
}

const CatsContext = React.createContext<CatsContextType | null>(null)

export function CatsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CatsDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Cat | null>(null)

  return (
    <CatsContext value={{ open, setOpen, currentRow, setCurrentRow }}>
      {children}
    </CatsContext>
  )
}

export const useCats = () => {
  const catsContext = React.useContext(CatsContext)
  if (!catsContext) {
    throw new Error('useCats has to be used within <CatsContext>')
  }
  return catsContext
}
