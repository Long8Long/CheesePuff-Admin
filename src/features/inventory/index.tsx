import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { InventoryCards } from './components/inventory-cards'
import { LowStockAlert } from './components/low-stock-alert'
import { InventoryTable } from './components/inventory-table'

export function Inventory() {
  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>库存管理</h2>
            <p className='text-muted-foreground'>
              管理商品库存信息，查看预警和明细
            </p>
          </div>
        </div>

        <InventoryCards />
        <LowStockAlert />
        <InventoryTable />
      </Main>
    </>
  )
}
