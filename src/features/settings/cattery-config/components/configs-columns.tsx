import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { type Config } from '../models/config.types'

interface ConfigsColumnProps {
  onEdit: (config: Config) => void
}

export function getConfigsColumns({ onEdit }: ConfigsColumnProps): ColumnDef<Config>[] {
  return [
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
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const config = row.original

        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1"
            onClick={() => onEdit(config)}
          >
            <Pencil1Icon className="h-3 w-3" />
            编辑
          </Button>
        )
      },
    },
  ]
}
