import axios from 'axios'
import { getCookie, removeCookie } from './cookies'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = getCookie('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
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
