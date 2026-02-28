import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { configsService } from '../services/configs.service'
import type { Config } from '../models/config.types'
import { configFormSchema, type ConfigFormData } from '../data/config-schema'
import { Plus, Trash2 } from 'lucide-react'

interface ConfigsMutateDialogProps {
  currentRow: Config | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConfigsMutateDialog({
  currentRow,
  open,
  onOpenChange,
}: ConfigsMutateDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [items, setItems] = useState<string[]>([''])
  const queryClient = useQueryClient()

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      value: [''],
      description: '',
    },
  })

  const { handleSubmit, reset } = form

  useEffect(() => {
    if (currentRow && open) {
      const rawValue = currentRow.value
      let valueArray: string[]

      if (Array.isArray(rawValue)) {
        valueArray = rawValue.length > 0 ? [...rawValue] : ['']
      } else {
        valueArray = [String(rawValue ?? '')]
      }

      setItems(valueArray)
      reset({
        value: valueArray,
        description: currentRow.description || '',
      })
    }
  }, [currentRow, open, reset])

  const onSubmit = async (data: ConfigFormData) => {
    if (!currentRow) return

    setIsSubmitting(true)
    try {
      // Filter out empty strings
      const processedValue = items.filter((v) => v.trim())

      await configsService.update(currentRow.key, {
        value: processedValue,
        description: data.description,
      })

      toast.success('配置更新成功')
      onOpenChange(false)
      form.reset()
      setItems([''])

      // Refetch configs list
      queryClient.invalidateQueries({ queryKey: ['configs'] })
    } catch (error) {
      toast.error('更新失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddItem = () => {
    setItems([...items, ''])
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index)
      setItems(newItems)
    }
  }

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    setItems(newItems)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>编辑配置</DialogTitle>
          <DialogDescription>
            可以添加、删除或修改每个选项。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入配置描述" className="max-w-[300px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={() => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>选项</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddItem}
                      className="h-8 gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      添加
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm w-6 shrink-0">
                          {index + 1}.
                        </span>
                        <FormControl>
                          <Input
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            placeholder={`输入配置项 ${index + 1}`}
                            className="font-mono text-sm"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          disabled={items.length <= 1}
                          className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
