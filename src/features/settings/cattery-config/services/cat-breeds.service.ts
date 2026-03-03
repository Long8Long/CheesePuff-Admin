import api from '@/lib/api'
import type { CatBreed } from '../models/cattery.types'
import type { CatBreedCreate, CatBreedUpdate } from '../models/cattery-api.types'

export const catBreedsService = {
  getList: async (): Promise<CatBreed[]> => {
    const { data } = await api.get<CatBreed[]>('/api/v1/admin/cat-breeds')
    return data
  },
  create: async (data: CatBreedCreate): Promise<CatBreed> => {
    const { data: responseData } = await api.post<CatBreed>('/api/v1/admin/cat-breeds', data)
    return responseData
  },
  update: async (id: string, data: CatBreedUpdate): Promise<CatBreed> => {
    const { data: responseData } = await api.put<CatBreed>(`/api/v1/admin/cat-breeds/${id}`, data)
    return responseData
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/cat-breeds/${id}`)
  },
}
