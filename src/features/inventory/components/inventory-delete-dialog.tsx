'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { InventoryItem } from '../models/inventory'

type InventoryDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: InventoryItem | null
  onSuccess?: () => void
}

export function InventoryDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: InventoryDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!currentRow) return

    setIsDeleting(true)

    // Mock delete - just show success and call callback
    await new Promise((resolve) => setTimeout(resolve, 500))

    toast.success(`已删除商品: ${currentRow.name}`)

    onOpenChange(false)

    // 触发成功回调（刷新列表）
    onSuccess?.()

    setIsDeleting(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isDeleting}
      title={
        <span className="text-destructive">
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />{' '}
          删除商品
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            确定要删除商品<strong>{currentRow?.name}</strong>
            吗？<br />
            此操作无法撤销。
          </p>
        </div>
      }
      confirmText={
        isDeleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            删除中...
          </>
        ) : (
          '删除'
        )
      }
      destructive
    />
  )
}
