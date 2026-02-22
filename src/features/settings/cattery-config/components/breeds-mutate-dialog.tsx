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
import { catBreedSchema, type CatBreedFormData } from '../data/schema'
import type { CatBreed } from '../models/cattery.types'
import type { CatBreedCreate, CatBreedUpdate } from '../models/cattery-api.types'
import { catBreedsService } from '../services/cat-breeds.service'

type BreedMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBreed?: CatBreed | null
}

export function BreedsMutateDialog({
  open,
  onOpenChange,
  currentBreed,
}: BreedMutateDialogProps) {
  const isUpdate = !!currentBreed

  const form = useForm<CatBreedFormData>({
    resolver: zodResolver(catBreedSchema),
    defaultValues: currentBreed
      ? {
          name: currentBreed.name,
        }
      : {
          name: '',
        },
  })

  const onSubmit = async (data: CatBreedFormData) => {
    try {
      if (isUpdate && currentBreed) {
        await catBreedsService.update(currentBreed.id, data as CatBreedUpdate)
        toast.success('品种更新成功')
      } else {
        await catBreedsService.create(data as CatBreedCreate)
        toast.success('品种创建成功')
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
          <DialogTitle>{isUpdate ? '编辑' : '新建'}品种</DialogTitle>
          <DialogDescription>
            {isUpdate ? '修改品种信息' : '添加一个新的品种'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="breeds-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>品种名称 *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入品种名称" />
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
          <Button form="breeds-form" type="submit">
            {isUpdate ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
