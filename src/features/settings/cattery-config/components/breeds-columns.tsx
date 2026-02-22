import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import type { CatBreed } from '../models/cattery.types'

export const breedsColumns: ColumnDef<CatBreed>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="品种名称" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.getValue('name')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="创建时间" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'))
      return <div className="text-sm text-muted-foreground">{date.toLocaleString('zh-CN')}</div>
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: 'actions',
    header: '操作',
    cell: () => {
      // Actions will be handled in the table component
      return null
    },
  },
]
