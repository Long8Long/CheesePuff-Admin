import api from '@/lib/api'
import type { CatStatus } from '../models/cattery.types'
import type { CatStatusCreate, CatStatusUpdate } from '../models/cattery-api.types'

export const catStatusesService = {
  getList: async (): Promise<CatStatus[]> => {
    const response = await api.get('/api/v1/admin/cat-statuses')
    return response.data.data
  },
  create: async (data: CatStatusCreate): Promise<CatStatus> => {
    const response = await api.post('/api/v1/admin/cat-statuses', data)
    return response.data.data
  },
  update: async (id: string, data: CatStatusUpdate): Promise<CatStatus> => {
    const response = await api.put(`/api/v1/admin/cat-statuses/${id}`, data)
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/cat-statuses/${id}`)
  },
}
