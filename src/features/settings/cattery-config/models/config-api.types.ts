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
