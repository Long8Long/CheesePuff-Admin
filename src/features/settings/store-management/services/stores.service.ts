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
    const response = await api.get('/api/v1/admin/stores', { params })
    return response.data.data
  },
  getById: async (id: string): Promise<StoreType> => {
    const response = await api.get(`/api/v1/admin/stores/${id}`)
    return response.data.data
  },
  create: async (data: StoreCreate): Promise<StoreType> => {
    const response = await api.post('/api/v1/admin/stores', data)
    return response.data.data
  },
  update: async (id: string, data: StoreUpdate): Promise<StoreType> => {
    const response = await api.put(`/api/v1/admin/stores/${id}`, data)
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/stores/${id}`)
  },
  bulkDelete: async (ids: string[]): Promise<void> => {
    // Note: backend may not support bulk delete yet
    await api.delete('/api/v1/admin/stores/bulk', { data: { ids } })
  },
}
