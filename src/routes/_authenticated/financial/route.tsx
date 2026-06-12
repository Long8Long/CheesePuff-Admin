import { createFileRoute } from '@tanstack/react-router'
import { Financial } from '@/features/financial'

export const Route = createFileRoute('/_authenticated/financial')({
  component: Financial,
})
