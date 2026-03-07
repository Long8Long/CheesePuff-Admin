export type StoreType = 'main' | 'branch'

export interface StoreLocation {
  latitude: number
  longitude: number
}

export interface Store {
  id: string
  name: string
  type: StoreType
  phone: string | null
  wechat: string | null
  address: string | null
  businessHours: string | null
  description: string | null
  isActive: boolean
  location: StoreLocation | null
  createdAt: string
  updatedAt: string
}
