import api from '@/lib/api'
import type { CatStatus } from '../models/cattery.types'
import type { CatStatusCreate, CatStatusUpdate } from '../models/cattery-api.types'

export const catStatusesService = {
  getList: async (): Promise<CatStatus[]> => {
    const { data } = await api.get<CatStatus[]>('/api/v1/admin/cat-statuses')
    return data
  },
  create: async (data: CatStatusCreate): Promise<CatStatus> => {
    const { data: responseData } = await api.post<CatStatus>('/api/v1/admin/cat-statuses', data)
    return responseData
  },
  update: async (id: string, data: CatStatusUpdate): Promise<CatStatus> => {
    const { data: responseData } = await api.put<CatStatus>(`/api/v1/admin/cat-statuses/${id}`, data)
    return responseData
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/cat-statuses/${id}`)
  },
}
