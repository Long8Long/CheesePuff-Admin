export interface GetStoresListParams {
  page?: number
  pageSize?: number
  activeOnly?: boolean
}

export interface StoreCreate {
  name: string
}

export interface StoreUpdate {
  name?: string | null
  isActive?: boolean | null
}

export interface PaginatedStoreResponse {
  stores: Store[]
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

import type { Store } from './store.types'
