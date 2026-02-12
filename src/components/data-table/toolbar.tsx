import { Cross2Icon, ReloadIcon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
  onRefresh,
  isRefreshing = false,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter
  const hasSorting = table.getState().sorting.length > 0
  const hasActiveFilters = isFiltered || hasSorting

  const handleReset = () => {
    table.resetColumnFilters()
    table.setGlobalFilter('')
    table.resetSorting()
    table.setSorting([])
    table.resetRowSelection()
    table.setPageIndex(0)
  }

  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchKey ? (
          <Input
            placeholder={searchPlaceholder}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        ) : (
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            onClick={handleReset}
            className='h-8 px-2 lg:px-3'
          >
            重置
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        {onRefresh && (
          <Button
            variant='outline'
            size='sm'
            onClick={onRefresh}
            disabled={isRefreshing}
            className='h-8'
          >
            <ReloadIcon className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
