import type { Config } from './config.types'

export interface GetConfigsListParams {
  page?: number
  pageSize?: number
  key?: string
}

export interface GetConfigsListResponse {
  configs: Config[]
  total: number
}

export interface ConfigUpdate {
  value: unknown
  description: string
}

export interface CatBreedsConfig {
  key: 'cat_breeds'
  value: string[]
  description: string
  id: string
  created_at: string
  updated_at: string
}

export interface CatStatusesConfig {
  key: 'cat_statuses'
  value: string[]
  description: string
  id: string
  created_at: string
  updated_at: string
}
