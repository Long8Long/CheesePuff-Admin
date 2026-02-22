import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { storesService } from '../services/stores.service'

type DataTableBulkActionsProps = {
  table: Table<Store>
}

export function DataTableBulkActions({
  table,
}: DataTableBulkActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkDelete = async () => {
    const ids = selectedRows.map((row) => row.original.id)
    try {
      await storesService.bulkDelete(ids)
      setShowDeleteConfirm(false)
      table.resetRowSelection()
      toast.success(`已删除 ${ids.length} 个门店`)
    } catch (error) {
      toast.error('批量删除失败')
    }
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName="个门店">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="删除选中的门店"
              title="删除选中的门店"
            >
              <Trash2 />
              <span className="sr-only">删除选中的门店</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>删除</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <StoresMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
        onDelete={handleBulkDelete}
      />
    </>
  )
}

import type { Store } from '../models/store.types'
import { StoresMultiDeleteDialog } from './stores-multi-delete-dialog'
