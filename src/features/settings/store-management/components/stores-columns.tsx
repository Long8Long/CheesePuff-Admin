import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import type { Store } from '../models/store.types'

export const storesColumns: ColumnDef<Store>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="门店名称" />
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
    accessorKey: 'storeType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="类型" />
    ),
    cell: ({ row }) => {
      const storeType = row.getValue('storeType') as string | null
      return (
        <Badge variant={storeType === 'main' ? 'default' : 'secondary'}>
          {storeType === 'main' ? '总店' : storeType === 'branch' ? '分店' : '-'}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'ownerContact',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="联系方式" />
    ),
    cell: ({ row }) => {
      const contact = row.getValue('ownerContact') as string | null
      return <div className="max-w-[150px] truncate">{contact || '-'}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'location',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="位置" />
    ),
    cell: ({ row }) => {
      const location = row.getValue('location') as string | null
      return <div className="max-w-[200px] truncate">{location || '-'}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'businessHours',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="营业时间" />
    ),
    cell: ({ row }) => {
      const hours = row.getValue('businessHours') as string | null
      return <div className="max-w-[150px] truncate">{hours || '-'}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'catteryDescription',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="猫舍介绍" />
    ),
    cell: ({ row }) => {
      const desc = row.getValue('catteryDescription') as string | null
      return <div className="max-w-[250px] truncate">{desc || '-'}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="操作" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
]
