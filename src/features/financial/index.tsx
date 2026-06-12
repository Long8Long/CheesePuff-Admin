import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { FinancialCards } from './components/financial-cards'
import { IncomeExpenseChart } from './components/income-expense-chart'
import { TransactionsTable } from './components/transactions-table'

export function Financial() {
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
            <h2 className='text-2xl font-bold tracking-tight'>财务统计</h2>
            <p className='text-muted-foreground'>
              查看财务数据概览和收支趋势
            </p>
          </div>
        </div>

        <FinancialCards />
        <IncomeExpenseChart />
        <TransactionsTable />
      </Main>
    </>
  )
}
