'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { productCategories } from '../data/mock-data'
import type { InventoryItem, InventoryFormData } from '../models/inventory'

const inventoryFormSchema = z.object({
  name: z.string().min(1, '商品名称不能为空'),
  category: z.string().min(1, '请选择分类'),
  currentStock: z.string().min(1, '库存不能为空'),
  unitPrice: z.string().min(1, '单价不能为空'),
  threshold: z.string().optional(),
})

type InventoryForm = z.infer<typeof inventoryFormSchema>

type InventoryFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: InventoryItem | null
  onSave: (data: InventoryFormData) => void
}

export function InventoryFormDialog({
  open,
  onOpenChange,
  currentRow,
  onSave,
}: InventoryFormDialogProps) {
  const isEdit = !!currentRow

  const form = useForm<InventoryForm>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: currentRow
      ? {
          name: currentRow.name,
          category: currentRow.category,
          currentStock: String(currentRow.currentStock),
          unitPrice: String(currentRow.unitPrice),
          threshold: currentRow.threshold ? String(currentRow.threshold) : '',
        }
      : {
          name: '',
          category: '',
          currentStock: '',
          unitPrice: '',
          threshold: '',
        },
  })

  const onSubmit = (data: InventoryForm) => {
    const stock = Number.parseInt(data.currentStock, 10)
    const price = Number.parseFloat(data.unitPrice)

    if (Number.isNaN(stock) || stock < 0) {
      form.setError('currentStock', { message: '库存必须是有效的非负整数' })
      return
    }

    if (Number.isNaN(price) || price <= 0 || price > 99999) {
      form.setError('unitPrice', { message: '单价必须是有效的正数' })
      return
    }

    const formData: InventoryFormData = {
      name: data.name,
      category: data.category,
      currentStock: stock,
      unitPrice: price,
      threshold: data.threshold ? Number.parseInt(data.threshold, 10) : undefined,
    }
    onSave(formData)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? (
              <>
                <Pencil className="mr-2 inline-block h-4 w-4" />
                编辑商品
              </>
            ) : (
              <>
                <Plus className="mr-2 inline-block h-4 w-4" />
                添加商品
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? '修改商品信息' : '添加新的商品到库存'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>商品名称</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="例如：渴望猫粮 鸡肉成猫配方 5.4kg"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分类</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {productCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>当前库存</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>单价(元)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>预警阈值(可选)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      placeholder="库存低于此值时预警"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                取消
              </Button>
              <Button type="submit">{isEdit ? '保存' : '添加'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
