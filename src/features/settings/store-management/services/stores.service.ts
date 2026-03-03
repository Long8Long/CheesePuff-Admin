import api from '@/lib/api'
import type {
  GetStoresListParams,
  StoreCreate,
  StoreUpdate,
  PaginatedStoreResponse,
} from '../models/store-api.types'
import type { Store as StoreType } from '../models/store.types'

export const storesService = {
  getList: async (params: GetStoresListParams): Promise<PaginatedStoreResponse> => {
    const { data } = await api.get<PaginatedStoreResponse>('/api/v1/admin/stores', { params })
    return data
  },
  getById: async (id: string): Promise<StoreType> => {
    const { data } = await api.get<StoreType>(`/api/v1/admin/stores/${id}`)
    return data
  },
  create: async (data: StoreCreate): Promise<StoreType> => {
    const { data: responseData } = await api.post<StoreType>('/api/v1/admin/stores', data)
    return responseData
  },
  update: async (id: string, data: StoreUpdate): Promise<StoreType> => {
    const { data: responseData } = await api.put<StoreType>(`/api/v1/admin/stores/${id}`, data)
    return responseData
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/stores/${id}`)
  },
  bulkDelete: async (ids: string[]): Promise<void> => {
    // Note: backend may not support bulk delete yet
    await api.delete('/api/v1/admin/stores/bulk', { data: { ids } })
  },
}
