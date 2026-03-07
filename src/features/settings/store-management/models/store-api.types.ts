export interface GetStoresListParams {
  page?: number
  pageSize?: number
  activeOnly?: boolean
}

export interface StoreLocation {
  latitude: number
  longitude: number
}

export interface StoreCreate {
  name: string
  type?: StoreType
  phone?: string | null
  wechat?: string | null
  address?: string | null
  businessHours?: string | null
  description?: string | null
  isActive?: boolean
  location?: StoreLocation | null
}

export interface StoreUpdate {
  name?: string | null
  type?: StoreType | null
  phone?: string | null
  wechat?: string | null
  address?: string | null
  businessHours?: string | null
  description?: string | null
  isActive?: boolean | null
  location?: StoreLocation | null
}

export interface StorePagination {
  page: number
  pageSize: number
  total: number
  pages: number
}

export interface PaginatedStoreResponse {
  stores: Store[]
  pagination: StorePagination
}

import type { Store } from './store.types'
export type { StoreType } from './store.types'
