import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { KpiCards } from './components/kpi-cards'
import { CatStatusChart } from './components/cat-status-chart'
import { BreedDistributionChart } from './components/breed-distribution-chart'
import { MemberGrowthChart } from './components/member-growth-chart'
import { StorePerformanceChart } from './components/store-performance-chart'

export function Statistics() {
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
            <h2 className='text-2xl font-bold tracking-tight'>数据统计</h2>
            <p className='text-muted-foreground'>
              系统核心业务数据指标总览
            </p>
          </div>
        </div>

        <KpiCards />

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-2'>
          <CatStatusChart />
          <BreedDistributionChart />
          <MemberGrowthChart />
          <StorePerformanceChart />
        </div>
      </Main>
    </>
  )
}
