import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CatsDialogs } from './components/cats-dialogs'
import { CatsPrimaryButtons } from './components/cats-primary-buttons'
import { CatsProvider } from './components/cats-provider'
import { CatsTable } from './components/cats-table'

export function Cats() {
  return (
    <CatsProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          {/* <LangSwitch /> */}
          {/* <ConfigDrawer /> */}
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>猫咪管理</h2>
            <p className='text-muted-foreground'>
              管理猫咖中的所有猫咪信息
            </p>
          </div>
          <CatsPrimaryButtons />
        </div>
        <CatsTable />
      </Main>

      <CatsDialogs />
    </CatsProvider>
  )
}
