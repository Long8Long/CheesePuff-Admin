export type StoreType = 'main' | 'branch'

export interface Store {
  id: string
  name: string
  storeType?: StoreType | null
  ownerContact?: string | null
  location?: string | null
  businessHours?: string | null
  catteryDescription?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}
