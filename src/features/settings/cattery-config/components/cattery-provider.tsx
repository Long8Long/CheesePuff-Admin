/* eslint-disable react-refresh/only-export-components */

import React from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import type { CatBreed } from '../models/cattery.types'
import type { CatStatus } from '../models/cattery.types'

type CatteryDialogType = 'breed-create' | 'breed-edit' | 'breed-delete' | 'status-create' | 'status-edit' | 'status-delete'

type CatteryContextType = {
  open: CatteryDialogType | null
  setOpen: (str: CatteryDialogType | null) => void
  currentBreed: CatBreed | null
  setCurrentBreed: React.Dispatch<React.SetStateAction<CatBreed | null>>
  currentStatus: CatStatus | null
  setCurrentStatus: React.Dispatch<React.SetStateAction<CatStatus | null>>
}

const CatteryContext = React.createContext<CatteryContextType | null>(null)

export function CatteryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useDialogState<CatteryDialogType>(null)
  const [currentBreed, setCurrentBreed] = React.useState<CatBreed | null>(null)
  const [currentStatus, setCurrentStatus] = React.useState<CatStatus | null>(null)

  return (
    <CatteryContext value={{ open, setOpen, currentBreed, setCurrentBreed, currentStatus, setCurrentStatus }}>
      {children}
    </CatteryContext>
  )
}

export const useCattery = () => {
  const catteryContext = React.useContext(CatteryContext)
  if (!catteryContext) {
    throw new Error('useCattery has to be used within <CatteryContext>')
  }
  return catteryContext
}
