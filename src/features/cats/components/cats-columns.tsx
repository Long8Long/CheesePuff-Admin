import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { Eye, EyeOff } from 'lucide-react'
import { statusColors } from '../data/data'
import { type Cat } from '../data/schema'
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
    header: '照片',
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='名称' />
    ),
    cell: ({ row }) => (
      <span className='font-medium'>{row.getValue('name')}</span>
    ),
  },
  {
    accessorKey: 'breed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='品种' />
    ),
    cell: ({ row }) => {
      const breed = row.getValue('breed') as string
      const breedEn = row.original.breedEn
      return (
        <div>
          <div className='font-medium'>{breed}</div>
          {breedEn && (
            <div className='text-xs text-muted-foreground'>{breedEn}</div>
          )}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'birthday',
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('catcafeStatus') as Cat['catcafeStatus']
      const statusLabel = {
        working: '工作中',
        resting: '休息中',
        sick: '生病中',
        retired: '已退休',
        pregnant: '怀孕中',
        nursing: '哺乳期',
      }[status]
      const colorClass = statusColors.get(status)

      return (
        <Badge variant='outline' className={colorClass}>
          {statusLabel}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'visible',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='可见' />
    ),
    cell: ({ row }) => {
      const visible = row.getValue('visible') as boolean
      return (
        <div className='flex justify-center'>
          {visible ? (
            <Eye className='size-4 text-muted-foreground' />
          ) : (
            <EyeOff className='size-4 text-muted-foreground' />
          )}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
