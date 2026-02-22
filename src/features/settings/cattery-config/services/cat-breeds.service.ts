import api from '@/lib/api'
import type { CatBreed } from '../models/cattery.types'
import type { CatBreedCreate, CatBreedUpdate } from '../models/cattery-api.types'

export const catBreedsService = {
  getList: async (): Promise<CatBreed[]> => {
    const response = await api.get('/api/v1/admin/cat-breeds')
    return response.data.data
  },
  create: async (data: CatBreedCreate): Promise<CatBreed> => {
    const response = await api.post('/api/v1/admin/cat-breeds', data)
    return response.data.data
  },
  update: async (id: string, data: CatBreedUpdate): Promise<CatBreed> => {
    const response = await api.put(`/api/v1/admin/cat-breeds/${id}`, data)
    return response.data.data
  },
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/admin/cat-breeds/${id}`)
  },
}
