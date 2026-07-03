import { createFileRoute } from '@tanstack/react-router'
import { Breeding } from '@/features/breeding'

export const Route = createFileRoute('/_authenticated/breeding')({
  component: Breeding,
})
