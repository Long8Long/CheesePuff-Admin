import type { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table/column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="类型" />
    ),
    cell: ({ row }) => {
      const type = row.getValue('type') as string | null
      return (
        <Badge variant={type === 'main' ? 'default' : 'secondary'}>
          {type === 'main' ? '总店' : type === 'branch' ? '分店' : '-'}
        </Badge>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'isActive',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="小程序可见" />
    ),
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean | null
      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive ?? false}
            disabled
            className="pointer-events-none"
          />
          <span className="text-sm text-muted-foreground">
            {isActive ? '可见' : '隐藏'}
          </span>
        </div>
      )
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="手机号" />
    ),
    cell: ({ row }) => {
      const phone = row.getValue('phone') as string | null
      return <div className="max-w-[150px] truncate">{phone || '-'}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'wechat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="微信号" />
    ),
    cell: ({ row }) => {
      const wechat = row.getValue('wechat') as string | null
      return <div className="max-w-[150px] truncate">{wechat || '-'}</div>
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'address',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="地址" />
    ),
    cell: ({ row }) => {
      const address = row.getValue('address') as string | null
      return <div className="max-w-[200px] truncate">{address || '-'}</div>
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
    accessorKey: 'description',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="猫舍介绍" />
    ),
    cell: ({ row }) => {
      const desc = row.getValue('description') as string | null
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
