import { createFileRoute } from '@tanstack/react-router'
import { Cats } from '@/features/cats'

export const Route = createFileRoute('/_authenticated/cats')({
  component: Cats,
})
