import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useMemo, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { getTodayString } from '@/lib/utils'
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ImageUpload } from '@/components/ui/image-upload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { SelectDropdown } from '@/components/select-dropdown'
import { breeds as defaultBreeds, catCafeStatuses, stores } from '../data/data'
import type { Cat } from '../data/schema'
import type { CatAIOutput } from '../data/ai-schema'
import { CatsAIFillTab } from './cats-ai-fill-tab'
import { BreedDialog } from './breed-dialog'

type CatMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Cat | null
}

const formSchema = z.object({
  name: z.string().min(1, '名称不能为空'),
  breed: z.string().min(1, '请选择品种'),
  store: z.string().min(1, '请选择店铺'),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
  price: z.string().min(1, '请输入价格'),
  image: z.string().min(1, '请上传一张图片'),
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
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('manual')
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set())
  const [customBreeds, setCustomBreeds] = useState<Array<{ label: string; value: string }>>([])

  // 合并默认品种和自定义品种
  const breeds = useMemo(() => {
    return [...defaultBreeds, ...customBreeds]
  }, [customBreeds])

  const handleAddBreed = (name: string) => {
    const newBreed = { label: name, value: name }
    setCustomBreeds((prev) => [...prev, newBreed])
    // 自动选中新添加的品种
    form.setValue('breed', name)
  }

  const form = useForm<CatForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow
      ? {
          name: currentRow.name,
          breed: currentRow.breed,
          store: currentRow.store,
          birthday: currentRow.birthday,
          price: String(currentRow.price),
          image: currentRow.images[0] || '',
          description: currentRow.description,
          catcafeStatus: currentRow.catcafeStatus,
          visible: currentRow.visible,
        }
      : {
          name: '',
          breed: '',
          store: '山东店',
          birthday: getTodayString(),
          price: '',
          image: '',
          description: '',
          catcafeStatus: 'working',
          visible: true,
        },
  })

  const onSubmit = (data: CatForm) => {
    // 将单个图片 URL 转换为数组（保持与现有数据结构兼容）
    const images = [data.image]

    const formData: Omit<Cat, 'id' | 'created_at' | 'updated_at'> = {
      name: data.name,
      breed: data.breed,
      store: data.store as Cat['store'],
      birthday: data.birthday,
      price: Number.parseFloat(data.price),
      images,
      thumbnail: data.image,
      description: data.description,
      catcafeStatus: data.catcafeStatus as Cat['catcafeStatus'],
      visible: data.visible,
    }

    onOpenChange(false)
    form.reset()
    setAiFilledFields(new Set())
    showSubmittedData(isUpdate ? { ...currentRow, ...formData } : formData)
  }

  const handleAIFill = (data: CatAIOutput) => {
    const newAiFilledFields = new Set<string>()

    // 填充表单字段
    if (data.name) {
      form.setValue('name', data.name)
      newAiFilledFields.add('name')
    }
    if (data.breed) {
      form.setValue('breed', data.breed)
      newAiFilledFields.add('breed')
    }
    if (data.store) {
      form.setValue('store', data.store)
      newAiFilledFields.add('store')
    }
    if (data.birthday) {
      form.setValue('birthday', data.birthday)
      newAiFilledFields.add('birthday')
    }
    if (data.price) {
      form.setValue('price', String(data.price))
      newAiFilledFields.add('price')
    }
    if (data.description) {
      form.setValue('description', data.description)
      newAiFilledFields.add('description')
    }
    if (data.catcafeStatus) {
      form.setValue('catcafeStatus', data.catcafeStatus)
      newAiFilledFields.add('catcafeStatus')
    }
    if (data.visible !== undefined) {
      form.setValue('visible', data.visible)
      newAiFilledFields.add('visible')
    }

    setAiFilledFields(newAiFilledFields)
    setActiveTab('manual') // 切换到手动填写 Tab 查看结果
  }

  const handleResetAI = () => {
    setAiFilledFields(new Set())
    form.reset()
  }

  // 监听对话框关闭，重置状态
  useEffect(() => {
    if (!open) {
      form.reset()
      setAiFilledFields(new Set())
      setActiveTab('manual')
    }
  }, [open, form])

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isUpdate ? '编辑' : '添加'}猫咪</DialogTitle>
          <DialogDescription>
            {isUpdate ? '修改猫咪信息' : '添加一只新的猫咪'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab 切换 */}
        {!isUpdate && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'ai' | 'manual')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">
                ✍️ 手动填写
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="mr-1 h-4 w-4" />
                AI 快速填充
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ai">
              <CatsAIFillTab onAIFill={handleAIFill} />
            </TabsContent>

            <TabsContent value="manual">
              <FormWrapper
                form={form}
                aiFilledFields={aiFilledFields}
                showAIBadge={aiFilledFields.size > 0}
                onResetAI={handleResetAI}
                onSubmit={onSubmit}
                breeds={breeds}
                onAddBreed={handleAddBreed}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* 编辑模式直接显示表单 */}
        {isUpdate && (
          <FormWrapper
            form={form}
            aiFilledFields={aiFilledFields}
            showAIBadge={false}
            onResetAI={handleResetAI}
            onSubmit={onSubmit}
            breeds={breeds}
            onAddBreed={handleAddBreed}
          />
        )}

        {/* Dialog Footer - 只在编辑模式或手动填写 Tab 时显示 */}
        {(isUpdate || activeTab === 'manual') && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button form="cats-form" type="submit">
              {isUpdate ? '保存' : '添加'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

// 表单内容组件（提取出来避免重复代码）
function FormWrapper({
  form,
  aiFilledFields,
  showAIBadge,
  onResetAI,
  onSubmit,
  breeds,
  onAddBreed,
}: {
  form: ReturnType<typeof useForm<CatForm>>
  aiFilledFields: Set<string>
  showAIBadge: boolean
  onResetAI: () => void
  onSubmit: (data: CatForm) => void
  breeds: Array<{ label: string; value: string }>
  onAddBreed: (name: string) => void
}) {
  const [showBreedDialog, setShowBreedDialog] = useState(false)

  return (
    <>
      {/* AI 填充成功提示 */}
      {showAIBadge && (
        <div className="mb-4 flex items-center justify-between rounded-md bg-primary/10 p-3 text-sm text-primary">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>AI已识别到{aiFilledFields.size}项内容</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onResetAI} className="h-7 text-xs">
            重置
          </Button>
        </div>
      )}

      <Form {...form}>
        <form id="cats-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    名称
                    {aiFilledFields.has('name') && <Badge />}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="请输入猫咪名称" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    品种
                    {aiFilledFields.has('breed') && <Badge />}
                  </FormLabel>
                  <div className="flex gap-2">
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder="请选择品种"
                      items={breeds}
                      allowAddNew
                      onAddNew={() => setShowBreedDialog(true)}
                      addNewLabel="添加新品种"
                      className="flex-1"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    生日
                    {aiFilledFields.has('birthday') && <Badge />}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="store"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>店铺</FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="请选择店铺"
                    items={stores}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    价格（元）
                    {aiFilledFields.has('price') && <Badge />}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="2500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  描述
                  {aiFilledFields.has('description') && <Badge />}
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="请输入猫咪的描述信息"
                    rows={3}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="catcafeStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    工作状态
                    {aiFilledFields.has('catcafeStatus') && <Badge />}
                  </FormLabel>
                  <SelectDropdown
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder="请选择状态"
                    items={catCafeStatuses}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-3">
              <FormLabel>是否可见</FormLabel>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.watch('visible')}
                  onCheckedChange={(checked) => form.setValue('visible', checked)}
                />
                <label className="text-sm text-muted-foreground">在猫咖中显示</label>
              </div>
            </div>
          </div>

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>图片</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>请上传一张猫咪图片</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {/* 添加新品种对话框 */}
      <BreedDialog
        open={showBreedDialog}
        onOpenChange={setShowBreedDialog}
        onAdd={onAddBreed}
      />
    </>
  )
}

// AI 填充标识徽章
function Badge() {
  return (
    <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
      <Sparkles className="mr-0.5 h-2.5 w-2.5" />
      AI
    </span>
  )
}
