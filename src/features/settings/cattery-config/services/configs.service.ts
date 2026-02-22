import api from '@/lib/api'
import type {
  GetConfigsListParams,
  GetConfigsListResponse,
  ConfigUpdate,
} from '../models/config-api.types'
import type { Config } from '../models/config.types'

export const configsService = {
  getList: async (params: GetConfigsListParams): Promise<GetConfigsListResponse> => {
    const response = await api.get('/api/v1/admin/configs', { params })
    return response.data
  },

  getById: async (id: string): Promise<Config> => {
    const response = await api.get(`/api/v1/admin/configs/${id}`)
    return response.data
  },

  update: async (key: string, data: ConfigUpdate): Promise<Config> => {
    const response = await api.put(`/api/v1/admin/configs/${key}`, data)
    return response.data
  },
}
