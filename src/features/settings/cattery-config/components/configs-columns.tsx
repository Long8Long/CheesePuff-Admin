import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Config } from '../models/config.types'

interface ConfigsColumnProps {
  onEdit: (config: Config) => void
}

export function getConfigsColumns({ onEdit }: ConfigsColumnProps): ColumnDef<Config>[] {
  return [
    {
      accessorKey: 'key',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="配置键" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate font-medium">
          {row.getValue('key')}
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'value',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="配置值" />
      ),
      cell: ({ row }) => {
        const value = row.getValue('value') as unknown
        const displayValue = Array.isArray(value)
          ? value.join(', ')
          : String(value)

        return (
          <div className="max-w-[300px] truncate" title={displayValue}>
            {displayValue}
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="描述" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[400px] truncate">
          {row.getValue('description') || '-'}
        </div>
      ),
      enableSorting: false,
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const config = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">打开菜单</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(config)}>
                编辑
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}
