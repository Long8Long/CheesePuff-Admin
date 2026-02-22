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
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { storeFormSchema, type StoreFormData } from '../data/store-schema'
import type { Store } from '../models/store.types'
import type { StoreCreate, StoreUpdate } from '../models/store-api.types'
import { storesService } from '../services/stores.service'

type StoreMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Store | null
}

export function StoresMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: StoreMutateDialogProps) {
  const isUpdate = !!currentRow

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: currentRow
      ? {
          name: currentRow.name,
          storeType: currentRow.storeType ?? undefined,
          ownerContact: currentRow.ownerContact ?? '',
          location: currentRow.location ?? '',
          businessHours: currentRow.businessHours ?? '',
          catteryDescription: currentRow.catteryDescription ?? '',
        }
      : {
          name: '',
          storeType: undefined,
          ownerContact: '',
          location: '',
          businessHours: '',
          catteryDescription: '',
        },
  })

  const onSubmit = async (data: StoreFormData) => {
    try {
      // For create: only send name (required field)
      // For update: send name and/or isActive
      const requestData: StoreCreate | StoreUpdate = isUpdate
        ? {
            name: data.name || undefined,
          }
        : {
            name: data.name,
          }

      if (isUpdate && currentRow) {
        await storesService.update(currentRow.id, requestData as StoreUpdate)
        toast.success('门店更新成功')
      } else {
        await storesService.create(requestData as StoreCreate)
        toast.success('门店创建成功')
      }

      onOpenChange(false)
      form.reset()
    } catch (error) {
      toast.error(isUpdate ? '更新失败' : '创建失败')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isUpdate ? '编辑' : '新建'}门店</DialogTitle>
          <DialogDescription>
            {isUpdate ? '修改门店信息' : '添加一个新的门店'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form id="stores-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>门店名称 <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入门店名称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="storeType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>门店类型</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="main" id="main" />
                        <label htmlFor="main" className="cursor-pointer">
                          总店
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="branch" id="branch" />
                        <label htmlFor="branch" className="cursor-pointer">
                          分店
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>老板联系方式</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入手机号码" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>位置</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入位置信息" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessHours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>营业时间</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例如：周一至周五 9:00-18:00" value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="catteryDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>猫舍介绍</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="请输入猫舍介绍"
                      rows={3}
                      value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)}
                    />
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
          <Button form="stores-form" type="submit">
            {isUpdate ? '保存' : '创建'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
