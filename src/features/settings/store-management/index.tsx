import { Main } from '@/components/layout/main'
import { StoresDialogs } from './components/stores-dialogs'
import { StoresPrimaryButtons } from './components/stores-primary-buttons'
import { StoresProvider } from './components/stores-provider'
import { StoresTable } from './components/stores-table'

export function SettingsStoreManagement() {
  return (
    <StoresProvider>
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">门店管理</h2>
            <p className="text-muted-foreground">
              管理所有门店信息
            </p>
          </div>
          <StoresPrimaryButtons />
        </div>
        <StoresTable />
      </Main>

      <StoresDialogs />
    </StoresProvider>
  )
}
