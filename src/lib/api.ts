import axios from 'axios'
import humps from 'humps'
import { getCookie, removeCookie } from './cookies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor - add auth token and convert camelCase to snake_case
api.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Convert request data from camelCase to snake_case
    // Skip transformation for FormData (multipart/form-data requests)
    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.data = humps.decamelizeKeys(config.data, {
        // Don't convert keys that are all uppercase (like IDs)
        process: (key: string) => {
          // If key is all uppercase or already snake_case, keep it as is
          if (/^[A-Z_]+$/.test(key)) {
            return key
          }
          return humps.decamelize(key)
        },
      });
    }

    // Convert request params from camelCase to snake_case
    if (config.params && typeof config.params === 'object') {
      config.params = humps.decamelizeKeys(config.params, {
        process: (key: string) => {
          if (/^[A-Z_]+$/.test(key)) {
            return key
          }
          return humps.decamelize(key)
        },
      })
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors and convert snake_case to camelCase
api.interceptors.response.use(
  (response) => {
    // Convert response data from snake_case to camelCase
    if (response.data && typeof response.data === 'object') {
      response.data = humps.camelizeKeys(response.data, {
        process: (key: string) => humps.camelize(key),
      })
    }
    return response
  },
  (error) => {
    if (error.response) {
      const { status, data, config } = error.response

      // Handle 401 unauthorized
      if (status === 401) {
        // Only redirect if user was already logged in (has Authorization header)
        // For login requests, let the error pass through to show the message
        const hasAuthToken = config?.headers?.Authorization

        if (hasAuthToken) {
          removeCookie('access_token')
          removeCookie('user')
          window.location.href = '/sign-in'
        }
        // For login requests without token, continue to show error message
      }

      // Handle other errors
      return Promise.reject({
        message: data?.message || data?.msg || 'Request failed',
        code: status,
        data: data,
      })
    }

    // Network error
    return Promise.reject({
      message: 'Network error, please check your connection',
      code: 0,
    })
  }
)

export default api
