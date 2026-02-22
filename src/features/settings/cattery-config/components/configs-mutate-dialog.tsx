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
import { Textarea } from '@/components/ui/textarea'
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
  const queryClient = useQueryClient()

  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      value: '',
      description: '',
    },
  })

  useEffect(() => {
    if (currentRow && open) {
      form.reset({
        value: Array.isArray(currentRow.value)
          ? currentRow.value.join('\n')
          : String(currentRow.value),
        description: currentRow.description || '',
      })
    }
  }, [currentRow, open, form])

  const onSubmit = async (data: ConfigFormData) => {
    if (!currentRow) return

    setIsSubmitting(true)
    try {
      // Convert string value to array if it contains newlines
      const processedValue = typeof data.value === 'string' && data.value.includes('\n')
        ? data.value.split('\n').filter((v: string) => v.trim())
        : data.value

      await configsService.update(currentRow.key, {
        value: processedValue,
        description: data.description,
      })

      toast.success('配置更新成功')
      onOpenChange(false)
      form.reset()

      // Refetch configs list
      queryClient.invalidateQueries({ queryKey: ['configs'] })
    } catch (error) {
      toast.error('更新失败')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑配置</DialogTitle>
          <DialogDescription>
            请每行输入一个值。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>配置值</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="每行输入一个配置项&#10;例如：&#10;豹猫妹妹&#10;纯白德文妹妹&#10;英短蓝猫"
                      rows={6}
                      className="font-mono text-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入配置描述" />
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
