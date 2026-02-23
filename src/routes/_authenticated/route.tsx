import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { authService } from '@/features/auth/services/auth.service'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const { auth } = useAuthStore.getState()
    if (!auth.accessToken) {
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
    }

    // Initialize user info if not already loaded
    if (!auth.user) {
      try {
        const response = await authService.getCurrentUser()
        if (response.code === 200 && response.data) {
          useAuthStore.getState().auth.setUser(response.data)
        }
      } catch {
        // If get current user fails, clear token and redirect to login
        useAuthStore.getState().auth.resetAccessToken()
        throw redirect({
          to: '/sign-in',
          search: { redirect: location.href },
        })
      }
    }
  },
  component: AuthenticatedLayout,
})
