/* eslint-disable react-hooks/incompatible-library */

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SelectDropdown } from '@/components/select-dropdown'
import { breeds, catCafeStatuses, getBreedEn } from '../data/data'
import type { Cat } from '../data/schema'

type CatMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Cat | null
}

const formSchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  breed: z.string().min(1, '请选择品种'),
  breedEn: z.string().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
  price: z.string().min(1, '请输入价格'),
  images: z.string().min(1, '请至少输入一张图片 URL'),
  description: z.string().min(1, '描述不能为空'),
  catcafeStatus: z.string().min(1, '请选择工作状态'),
  visible: z.boolean(),
})

type CatForm = z.infer<typeof formSchema>

export function CatsMutateDialog({
  open,
  onOpenChange,
  currentRow,
}: CatMutateDialogProps) {
  const isUpdate = !!currentRow

  const form = useForm<CatForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          name: currentRow.name,
          breed: currentRow.breed,
          breedEn: currentRow.breedEn || '',
          birthday: currentRow.birthday,
          price: String(currentRow.price),
          images: currentRow.images.join('\n'),
          description: currentRow.description,
          catcafeStatus: currentRow.catcafeStatus,
          visible: currentRow.visible,
        }
      : {
          name: '',
          breed: '',
          breedEn: '',
          birthday: '',
          price: '',
          images: '',
          description: '',
          catcafeStatus: 'working',
          visible: true,
        },
  })

  const onSubmit = (data: CatForm) => {
    // 将图片字符串转换为数组
    const images = data.images.split('\n').filter((url) => url.trim() !== '')

    const formData: Omit<Cat, 'id' | 'created_at' | 'updated_at'> = {
      name: data.name,
      breed: data.breed,
      breedEn: data.breedEn || getBreedEn(data.breed),
      birthday: data.birthday,
      price: Number.parseFloat(data.price),
      images,
      thumbnail: images[0],
      description: data.description,
      catcafeStatus: data.catcafeStatus as Cat['catcafeStatus'],
      visible: data.visible,
    }

    onOpenChange(false)
    form.reset()
    showSubmittedData(isUpdate ? { ...currentRow, ...formData } : formData)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{isUpdate ? '编辑' : '添加'}猫咪</DialogTitle>
          <DialogDescription>
            {isUpdate ? '修改猫咪信息' : '添加一只新的猫咪'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id='cats-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>名称</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='请输入猫咪名称' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='breed'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>品种</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='请选择品种'
                      items={breeds}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='breedEn'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>英文名（可选）</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='如：Ragdoll' />
                  </FormControl>
                  <FormDescription>
                    留空将根据品种自动填充
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='birthday'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>生日</FormLabel>
                    <FormControl>
                      <Input {...field} type='date' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>价格（元）</FormLabel>
                    <FormControl>
                      <Input {...field} type='number' placeholder='2500' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>图片 URL</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='每行一个图片 URL&#10;https://example.com/cat1.jpg&#10;https://example.com/cat2.jpg'
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    每行输入一个图片 URL，至少需要一张
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder='请输入猫咪的描述信息'
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='catcafeStatus'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>工作状态</FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='请选择状态'
                      items={catCafeStatuses}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='space-y-3'>
                <FormLabel>是否可见</FormLabel>
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={form.watch('visible')}
                    onCheckedChange={(checked) =>
                      form.setValue('visible', checked)
                    }
                  />
                  <label className='text-sm text-muted-foreground'>
                    在猫咖中显示
                  </label>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button form='cats-form' type='submit'>
            {isUpdate ? '保存' : '添加'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
