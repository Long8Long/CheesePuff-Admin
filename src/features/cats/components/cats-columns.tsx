import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff } from 'lucide-react'
import { DataTableColumnHeader } from '@/components/data-table'
import { statusColors } from '../data/data'
import type { Cat } from '../models'
import { DataTableRowActions } from './data-table-row-actions'

// 计算年龄
function calculateAge(birthday: string): string {
  const birth = new Date(birthday)
  const now = new Date()
  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    years--
    months += 12
  }

  if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
    months += 12
  }

  if (years < 1) {
    return `${months} 个月`
  }
  return `${years} 岁 ${months > 0 ? `${months} 个月` : ''}`
}

// 格式化价格
function formatPrice(price: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(price)
}

export const catsColumns: ColumnDef<Cat>[] = [
  {
    id: 'select',
    meta: {
      i18nKey: 'dataTable.cats.columns.select',
    },
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'thumbnail',
    meta: {
      i18nKey: 'dataTable.cats.columns.thumbnail',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='照片' />
    ),
    cell: ({ row }) => {
      const thumbnail = row.getValue('thumbnail') as string
      return (
        <div className='size-12 overflow-hidden rounded-md bg-muted'>
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={row.getValue('name')}
              className='size-full object-cover'
              loading='lazy'
            />
          ) : (
            <div className='flex size-full items-center justify-center text-muted-foreground text-xs'>
              无图
            </div>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    meta: {
      i18nKey: 'dataTable.cats.columns.name',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='名称' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'breed',
    meta: {
      i18nKey: 'dataTable.cats.columns.breed',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='品种' />
    ),
    cell: ({ row }) => {
      const breed = row.getValue('breed') as string
      return <span className='font-medium'>{breed}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'store',
    meta: {
      i18nKey: 'dataTable.cats.columns.store',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='店铺' />
    ),
    cell: ({ row }) => {
      const store = row.getValue('store') as string
      return <span className='font-medium'>{store}</span>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'birthday',
    meta: {
      i18nKey: 'dataTable.cats.columns.birthday',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='年龄' />
    ),
    cell: ({ row }) => {
      const birthday = row.getValue('birthday') as string
      const age = calculateAge(birthday)
      return (
        <div>
          <div className='text-sm'>{age}</div>
          <div className='text-xs text-muted-foreground'>{birthday}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'price',
    meta: {
      i18nKey: 'dataTable.cats.columns.price',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='价格' />
    ),
    cell: ({ row }) => {
      const price = row.getValue('price') as number
      return <span className='font-medium'>{formatPrice(price)}</span>
    },
  },
  {
    accessorKey: 'catcafeStatus',
    meta: {
      i18nKey: 'dataTable.cats.columns.catcafeStatus',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('catcafeStatus') as Cat['catcafeStatus']
      if (!status) return null
      const colorClass = statusColors.get(status)

      return (
        <Badge variant='outline' className={colorClass}>
          {status}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'visible',
    meta: {
      i18nKey: 'dataTable.cats.columns.visible',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='可见性' />
    ),
    cell: ({ row }) => {
      const visible = row.getValue('visible') as boolean
      return (
        <div className='flex'>
          {visible ? (
            <Eye className='size-4' />
          ) : (
            <EyeOff className='size-4' />
          )}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    meta: {
      i18nKey: 'dataTable.cats.columns.actions',
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='操作' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
  },
]
