import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
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
  FormMessage,
} from '@/components/ui/form'

const addBreedSchema = z.object({
  name: z.string().min(1, '品种名称不能为空'),
})

type AddBreedForm = z.infer<typeof addBreedSchema>

type BreedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (name: string) => void
}

export function BreedDialog({ open, onOpenChange, onAdd }: BreedDialogProps) {
  const form = useForm<AddBreedForm>({
    resolver: zodResolver(addBreedSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = (data: AddBreedForm) => {
    onAdd(data.name)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加新品种</DialogTitle>
          <DialogDescription>
            输入猫咪品种名称，添加到列表中
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="例如：英国短毛猫"
                      autoFocus
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
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" />
                添加
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
