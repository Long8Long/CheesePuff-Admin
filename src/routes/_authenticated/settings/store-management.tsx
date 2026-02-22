import { createFileRoute } from '@tanstack/react-router'
import { SettingsStoreManagement } from '@/features/settings/store-management'

export const Route = createFileRoute('/_authenticated/settings/store-management')({
  component: SettingsStoreManagement,
})
