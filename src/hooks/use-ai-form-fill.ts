import { useState } from 'react'
import api from '@/lib/api'

export interface FormFillResponse {
  [key: string]: unknown
}

/**
 * Hook for AI form filling functionality
 * Calls the backend API at /api/v1/ai/form/fill
 */
export function useAIFormFill() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fill = async (formType: string, text: string): Promise<FormFillResponse> => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post<{ data: FormFillResponse }>('/api/v1/ai/form/fill', {
        form_type: formType,
        text,
      })
      return response.data.data
    } catch (err) {
      let errorMessage = 'AI 填充失败'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        errorMessage = axiosError.response?.data?.message || 'AI 填充失败'
      } else if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { fill, loading, error }
}
