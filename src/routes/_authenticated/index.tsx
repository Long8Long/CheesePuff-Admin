import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: async () => {
    // Redirect to cats page when accessing authenticated root
    throw redirect({
      to: '/cats',
      replace: true,
    })
  },
})
