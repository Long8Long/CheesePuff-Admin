import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BreedingCards } from './components/breeding-cards'
import { BreedingKanban } from './components/breeding-kanban'
import { BreedingRecordsTable } from './components/breeding-records-table'

export function Breeding() {
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
            <h2 className='text-2xl font-bold tracking-tight'>育种管理</h2>
            <p className='text-muted-foreground'>
              管理猫咪育种记录和流程
            </p>
          </div>
        </div>

        <BreedingCards />
        <BreedingKanban />
        <BreedingRecordsTable />
      </Main>
    </>
  )
}
