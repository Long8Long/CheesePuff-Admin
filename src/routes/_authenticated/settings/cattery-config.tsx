import { createFileRoute } from '@tanstack/react-router'
import { SettingsCatteryConfig } from '@/features/settings/cattery-config'

export const Route = createFileRoute('/_authenticated/settings/cattery-config')({
  component: SettingsCatteryConfig,
})
