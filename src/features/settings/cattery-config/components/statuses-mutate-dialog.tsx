import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { catStatusSchema, type CatStatusFormData } from '../data/schema'
import type { CatStatus } from '../models/cattery.types'
import type { CatStatusCreate, CatStatusUpdate } from '../models/cattery-api.types'
import { catStatusesService } from '../services/cat-statuses.service'

type StatusMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStatus?: CatStatus | null
}

export function StatusesMutateDialog({
  open,
  onOpenChange,
  currentStatus,
}: StatusMutateDialogProps) {
  const isUpdate = !!currentStatus

  const form = useForm<CatStatusFormData>({
    resolver: zodResolver(catStatusSchema),
    defaultValues: currentStatus
      ? {
          name: currentStatus.name,
        }
      : {
          name: '',
        },
  })

  const onSubmit = async (data: CatStatusFormData) => {
    try {
      if (isUpdate && currentStatus) {
        await catStatusesService.update(currentStatus.id, data as CatStatusUpdate)
        toast.success('状态更新成功')
      } else {
        await catStatusesService.create(data as CatStatusCreate)
        toast.success('状态创建成功')
      }

      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(isUpdate ? '更新失败' : '创建失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isUpdate ? '编辑' : '新建'}状态</DialogTitle>
          <DialogDescription>
            {isUpdate ? '修改状态信息' : '添加一个新的状态'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="statuses-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>状态名称 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入状态名称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button form="statuses-form" type="submit">
            {isUpdate ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
