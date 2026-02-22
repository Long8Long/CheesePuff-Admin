import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { useQueryClient } from '@tanstack/react-query'
import { Trash2, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { catCafeStatuses } from '../data/data'
import { CatsMultiDeleteDialog } from './cats-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const queryClient = useQueryClient()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleSuccess = () => {
    // 刷新猫咪列表
    queryClient.invalidateQueries({ queryKey: ['cats'] })
  }

  const handleBulkStatusChange = (status: string) => {
    const statusLabel = catCafeStatuses.find((s) => s.value === status)?.label
    toast.promise(sleep(1000), {
      loading: '更新状态中...',
      success: () => {
        table.resetRowSelection()
        return `已将 ${selectedRows.length} 只猫咪状态更新为 "${statusLabel}"`
      },
      error: '更新失败',
    })
  }

  const handleBulkVisibilityChange = (visible: boolean) => {
    toast.promise(sleep(1000), {
      loading: '更新可见性中...',
      success: () => {
        table.resetRowSelection()
        return `已${visible ? '显示' : '隐藏'} ${selectedRows.length} 只猫咪`
      },
      error: '更新失败',
    })
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='只猫咪'>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label='更新状态'
                  title='更新状态'
                >
                  <Eye />
                  <span className='sr-only'>更新状态</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>更新状态</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {catCafeStatuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  className='size-8'
                  aria-label='更新可见性'
                  title='更新可见性'
                >
                  <EyeOff />
                  <span className='sr-only'>更新可见性</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>更新可见性</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            <DropdownMenuItem onClick={() => handleBulkVisibilityChange(true)}>
              <Eye className='mr-2 size-4' />
              设为可见
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkVisibilityChange(false)}>
              <EyeOff className='mr-2 size-4' />
              设为隐藏
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='删除选中的猫咪'
              title='删除选中的猫咪'
            >
              <Trash2 />
              <span className='sr-only'>删除选中的猫咪</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <CatsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
        onSuccess={handleSuccess}
      />
    </>
  )
}
