/* eslint-disable react-refresh/only-export-components */

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { Store } from '../models/store.types'

type StoresDialogType = 'create' | 'edit' | 'delete'

type StoresContextType = {
  open: StoresDialogType | null
  setOpen: (str: StoresDialogType | null) => void
  currentRow: Store | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Store | null>>
  refetch: () => void
  setRefetch: React.Dispatch<React.SetStateAction<() => void>>
}

const StoresContext = React.createContext<StoresContextType | null>(null)

export function StoresProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<StoresDialogType>(null)
  const [currentRow, setCurrentRow] = React.useState<Store | null>(null)
  const [refetch, setRefetch] = React.useState<() => void>(() => () => {})

  return (
    <StoresContext value={{ open, setOpen, currentRow, setCurrentRow, refetch, setRefetch }}>
      {children}
    </StoresContext>
  )
}

export const useStores = () => {
  const storesContext = React.useContext(StoresContext)
  if (!storesContext) {
    throw new Error('useStores has to be used within <StoresContext>')
  }
  return storesContext
}
