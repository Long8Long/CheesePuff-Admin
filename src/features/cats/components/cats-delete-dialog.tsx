'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Cat } from '../models'
import { catsService } from '../services/cats.service'

type CatDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Cat | null
  onSuccess?: () => void
}

export function CatsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: CatDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!currentRow) return

    setIsDeleting(true)

    try {
      await catsService.delete(currentRow.id)
      toast.success(`已删除猫咪: ${currentRow.name || currentRow.id}`)

      onOpenChange(false)

      // 触发成功回调（刷新列表）
      onSuccess?.()
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || '删除失败，请重试'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          删除猫咪
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            确定要删除猫咪 <strong>{currentRow?.name || currentRow?.id}</strong>
            吗？<br />
            此操作无法撤销。
          </p>

          <Alert variant='destructive'>
            <AlertTitle>警告！</AlertTitle>
            <AlertDescription>
              此操作不可撤销，请谨慎操作。
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          删除中...
        </>
      ) : (
        '删除'
      )}
      destructive
    />
  )
}

type CatMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
  onSuccess?: () => void
}

export function CatsMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
  onSuccess,
}: CatMultiDeleteDialogProps<TData>) {
  const [isDeleting, setIsDeleting] = useState(false)

  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const ids = selectedRows.map((row) => (row.original as Cat).id)
      await catsService.bulkDelete(ids)

      toast.success(`已删除 ${selectedRows.length} 只猫咪`)
      table.resetRowSelection()

      onOpenChange(false)

      // 触发成功回调（刷新列表）
      onSuccess?.()
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || '删除失败，请重试'
      toast.error(errorMessage)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={isDeleting}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />{' '}
          批量删除
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            确定要删除选中的 {selectedRows.length} 只猫咪吗？<br />
            此操作无法撤销。
          </p>

          <Alert variant='destructive'>
            <AlertTitle>警告！</AlertTitle>
            <AlertDescription>
              此操作不可撤销，请谨慎操作。
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText={isDeleting ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          删除中...
        </>
      ) : (
        '删除'
      )}
      destructive
    />
  )
}
