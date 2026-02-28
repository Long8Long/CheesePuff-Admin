import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useMemo, useEffect } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { getTodayString } from '@/lib/utils'
import { Button } from '@/components/ui/button'
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
import type { Cat, CatCreate, CatUpdate } from '../models'
import type { CatAIOutput } from '../data/ai-schema'
import { catsService } from '../services/cats.service'
import { uploadService } from '../services/uploads.service'
import { CatsAIFillTab } from './cats-ai-fill-tab'
import { BreedDialog } from './breed-dialog'
import { configsService } from '@/features/settings/cattery-config/services/configs.service'
import { storesService } from '@/features/settings/store-management/services/stores.service'

type CatMutateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: Cat | null
  onSuccess?: () => void
}

const formSchema = z.object({
  name: z.string().optional(),
  breed: z.string().min(1, '请选择品种'),
  storeName: z.string().optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式错误'),
  price: z.string().optional(),
  images: z.array(z.string()).optional(),
  description: z.string().optional(),
  catcafeStatus: z.string().optional(),
  visible: z.boolean().optional(),
})

type CatForm = z.infer<typeof formSchema>

export function CatsMutateDialog({
  open,
  onOpenChange,
  currentRow,
  onSuccess,
}: CatMutateDialogProps) {
  const isUpdate = !!currentRow
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('manual')
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set())
  const [apiBreeds, setApiBreeds] = useState<Array<{ label: string; value: string }>>([])
  const [apiStatuses, setApiStatuses] = useState<Array<{ label: string; value: string }>>([])
  const [apiStores, setApiStores] = useState<Array<{ label: string; value: string }>>([])
  const [customBreeds, setCustomBreeds] = useState<Array<{ label: string; value: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(true)
  const [isLoadingStatuses, setIsLoadingStatuses] = useState(true)
  const [isLoadingStores, setIsLoadingStores] = useState(true)

  // Fetch breeds, statuses and stores from API on component mount
  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        setIsLoadingBreeds(true)
        setIsLoadingStatuses(true)
        setIsLoadingStores(true)

        // Fetch breeds
        const breedsResponse = await configsService.getByKey('cat_breeds')
        const breedValues = breedsResponse.value as string[]
        const breeds = breedValues.map((breed) => ({
          label: breed,
          value: breed,
        }))
        setApiBreeds(breeds)

        // Fetch statuses
        const statusesResponse = await configsService.getByKey('cat_statuses')
        const statusValues = statusesResponse.value as string[]
        const statuses = statusValues.map((status) => ({
          label: status,
          value: status,
        }))
        setApiStatuses(statuses)

        // Fetch stores
        const storesResponse = await storesService.getList({ activeOnly: true })
        const stores = storesResponse.stores
          .filter((store) => store.isActive)
          .map((store) => ({
            label: store.name,
            value: store.name,
          }))
        setApiStores(stores)
      } catch (error) {
        console.error('Failed to fetch cat config data:', error)
        toast.error('获取配置数据失败')
      } finally {
        setIsLoadingBreeds(false)
        setIsLoadingStatuses(false)
        setIsLoadingStores(false)
      }
    }

    fetchConfigData()
  }, [])

  // 合并API品种和自定义品种
  const breeds = useMemo(() => {
    return [...apiBreeds, ...customBreeds]
  }, [apiBreeds, customBreeds])

  // 获取默认店铺（第一个激活的店铺）
  const defaultStore = useMemo(() => {
    return apiStores.length > 0 ? apiStores[0].value : ''
  }, [apiStores])

  // 获取默认工作状态（第一个状态）
  const defaultStatus = useMemo(() => {
    return apiStatuses.length > 0 ? apiStatuses[0].value : ''
  }, [apiStatuses])

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
          name: currentRow.name ?? '',
          breed: currentRow.breed,
          storeName: currentRow.storeName ?? undefined,
          birthday: currentRow.birthday ?? undefined,
          price: String(currentRow.price ?? ''),
          images: currentRow.images ?? [],
          description: currentRow.description ?? '',
          catcafeStatus: currentRow.catcafeStatus ?? undefined,
          visible: currentRow.visible,
        }
      : {
          name: '',
          breed: '',
          storeName: defaultStore || undefined,
          birthday: getTodayString(),
          price: '',
          images: [],
          description: '',
          catcafeStatus: defaultStatus || undefined,
          visible: true,
        },
  })

  const onSubmit = async (data: CatForm) => {
    setIsSubmitting(true)

    try {
      // 辅助函数：将空字符串转为 null
      const emptyStringToNull = <T,>(value: T | string | undefined): T | null => {
        if (value === '' || value === undefined) return null
        return value as T
      }

      // 构建请求数据
      const requestData: CatCreate | CatUpdate = {
        name: emptyStringToNull(data.name),
        breed: data.breed,
        storeName: emptyStringToNull(data.storeName),
        birthday: data.birthday,
        price: data.price ? Number.parseFloat(data.price) : null,
        images: data.images && data.images.length > 0 ? data.images : null,
        thumbnail: data.images && data.images.length > 0 ? data.images[0] : null,
        description: emptyStringToNull(data.description),
        catcafeStatus: emptyStringToNull<Cat['catcafeStatus']>(data.catcafeStatus),
        visible: data.visible ?? true,
      }

      if (isUpdate && currentRow) {
        // 更新猫咪
        await catsService.update(currentRow.id, requestData as CatUpdate)
        toast.success('猫咪更新成功')
      } else {
        // 创建新猫咪
        await catsService.create(requestData as CatCreate)
        toast.success('猫咪添加成功')
      }

      // 关闭对话框并重置表单
      onOpenChange(false)
      form.reset()
      setAiFilledFields(new Set())

      // 触发成功回调（刷新列表）
      onSuccess?.()
    } catch (error) {
      const errorMessage = (error as { message?: string })?.message || '操作失败，请重试'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
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
    if (data.storeName) {
      form.setValue('storeName', data.storeName)
      newAiFilledFields.add('storeName')
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
    if (data.visible !== undefined && data.visible !== null) {
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
                isLoadingBreeds={isLoadingBreeds}
                apiStatuses={apiStatuses}
                isLoadingStatuses={isLoadingStatuses}
                apiStores={apiStores}
                isLoadingStores={isLoadingStores}
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
            isLoadingBreeds={isLoadingBreeds}
            apiStatuses={apiStatuses}
            isLoadingStatuses={isLoadingStatuses}
            apiStores={apiStores}
            isLoadingStores={isLoadingStores}
          />
        )}

        {/* Dialog Footer - 只在编辑模式或手动填写 Tab 时显示 */}
        {(isUpdate || activeTab === 'manual') && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              取消
            </Button>
            <Button form="cats-form" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUpdate ? '保存中...' : '添加中...'}
                </>
              ) : (
                isUpdate ? '保存' : '添加'
              )}
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
  isLoadingBreeds,
  apiStatuses,
  isLoadingStatuses,
  apiStores,
  isLoadingStores,
}: {
  form: ReturnType<typeof useForm<CatForm>>
  aiFilledFields: Set<string>
  showAIBadge: boolean
  onResetAI: () => void
  onSubmit: (data: CatForm) => void
  breeds: Array<{ label: string; value: string }>
  onAddBreed: (name: string) => void
  isLoadingBreeds?: boolean
  apiStatuses: Array<{ label: string; value: string }>
  isLoadingStatuses?: boolean
  apiStores: Array<{ label: string; value: string }>
  isLoadingStores?: boolean
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
                   品种 <span className="text-destructive">*</span>
                    {aiFilledFields.has('breed') && <Badge />}
                  </FormLabel>
                  <div className="flex gap-2">
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={isLoadingBreeds ? '加载品种列表中...' : '请选择品种'}
                      items={breeds}
                      allowAddNew
                      onAddNew={() => setShowBreedDialog(true)}
                      addNewLabel="添加新品种"
                      className="flex-1"
                      disabled={isLoadingBreeds}
                    />
                    {isLoadingBreeds && (
                      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    )}
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
                    生日 <span className="text-destructive">*</span>
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
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>店铺</FormLabel>
                  <div className="flex gap-2">
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={isLoadingStores ? '加载店铺列表中...' : '请选择店铺'}
                      items={apiStores}
                      className="flex-1"
                      disabled={isLoadingStores}
                    />
                    {isLoadingStores && (
                      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    )}
                  </div>
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
                  <div className="flex gap-2">
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={isLoadingStatuses ? '加载状态列表中...' : '请选择状态'}
                      items={apiStatuses}
                      className="flex-1"
                      disabled={isLoadingStatuses}
                    />
                    {isLoadingStatuses && (
                      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                    )}
                  </div>
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>图片</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    maxCount={5}
                    uploadFn={async (files) => {
                      const results = await uploadService.uploadCatImages(files)
                      return results
                        .filter((r) => r.success && r.originalUrl)
                        .map((r) => ({
                          url: r.originalUrl as string,
                          thumbnailUrl: r.thumbnailUrl || r.originalUrl || '',
                        }))
                    }}
                  />
                </FormControl>
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
