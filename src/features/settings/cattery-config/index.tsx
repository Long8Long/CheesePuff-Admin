import { Main } from '@/components/layout/main'
import { ConfigsTable } from './components/configs-table'

export function SettingsCatteryConfig() {
  return (
    <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">猫舍配置管理</h2>
          <p className="text-muted-foreground">
            管理猫咪品种、状态等配置项
          </p>
        </div>
      </div>

      <ConfigsTable />
    </Main>
  )
}
