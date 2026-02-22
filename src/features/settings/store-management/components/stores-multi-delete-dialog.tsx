import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'

type StoresMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Store>
  onDelete: () => void
}

import type { Store } from '../models/store.types'

export function StoresMultiDeleteDialog({
  open,
  onOpenChange,
  table,
  onDelete,
}: StoresMultiDeleteDialogProps) {
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    onDelete()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{' '}
          批量删除
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            确定要删除选中的 {selectedRows.length} 个门店吗？<br />
            此操作无法撤销。
          </p>

          <Alert variant="destructive">
            <AlertTitle>警告！</AlertTitle>
            <AlertDescription>
              此操作不可撤销，请谨慎操作。
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="删除"
      destructive
    />
  )
}
