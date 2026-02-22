import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { Store } from '../models/store.types'
import { storesService } from '../services/stores.service'

type StoreDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Store | null
}

export function StoresDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: StoreDeleteDialogProps) {
  const handleDelete = async () => {
    if (!currentRow) return

    try {
      await storesService.delete(currentRow.id)
      onOpenChange(false)
      toast.success(`已删除门店: ${currentRow.name}`)
    } catch (error) {
      toast.error('删除失败')
    }
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
          删除门店
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            确定要删除门店 <strong>{currentRow?.name}</strong>
            吗？<br />
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
