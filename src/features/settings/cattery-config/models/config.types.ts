export interface Config {
  id: string
  key: string
  value: unknown // Can be string, number, array, object, etc.
  description: string | null
  created_at: string
  updated_at: string
}

export type ConfigValue = string | number | boolean | unknown[] | Record<string, unknown>
