import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useMemo, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { VideoUpload } from '@/components/ui/video-upload'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SelectDropdown } from '@/components/select-dropdown'
import { BreedCombobox } from './breed-combobox'
import type { Cat, CatCreate, CatUpdate } from '../models'
import type { CatAIOutput } from '../data/ai-schema'
import { mediaItemSchema } from '../data/schema'
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
  // 配对结构：原图/视频与其缩略图原子绑定，与 Cat.images/Cat.videos 结构一致
  images: z.array(mediaItemSchema).optional(),
  videos: z.array(mediaItemSchema).optional(),
  // 身份卡图片（小程序详情页展示，当前限 1 张，结构预留多张）
  idCardImage: z.array(mediaItemSchema).optional(),
  description: z.string().optional(),
  catcafeStatus: z.string().min(1, '请选择工作状态'),
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
  const continueAddingRef = useRef(false)
  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('manual')
  const [aiFilledFields, setAiFilledFields] = useState<Set<string>>(new Set())
  const [customBreeds, setCustomBreeds] = useState<Array<{ label: string; value: string }>>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)

  // 使用 TanStack Query 获取配置数据，自动处理缓存和去重
  const breedsQuery = useQuery({
    queryKey: ['config', 'cat_breeds'],
    queryFn: () => configsService.getByKey('cat_breeds'),
  })

  const statusesQuery = useQuery({
    queryKey: ['config', 'cat_statuses'],
    queryFn: () => configsService.getByKey('cat_statuses'),
  })

  const storesQuery = useQuery({
    queryKey: ['stores', 'active'],
    queryFn: () => storesService.getList({ activeOnly: true }),
  })

  // 从 query 数据中转换格式
  const apiBreeds = useMemo(() => {
    if (breedsQuery.data?.value) {
      const breedValues = breedsQuery.data.value as string[]
      return breedValues.map((breed) => ({ label: breed, value: breed }))
    }
    return []
  }, [breedsQuery.data])

  const apiStatuses = useMemo(() => {
    if (statusesQuery.data?.value) {
      const statusValues = statusesQuery.data.value as string[]
      return statusValues.map((status) => ({ label: status, value: status }))
    }
    return []
  }, [statusesQuery.data])

  const apiStores = useMemo(() => {
    if (storesQuery.data?.stores) {
      return storesQuery.data.stores
        .filter((store) => store.isActive)
        .map((store) => ({ label: store.name, value: store.name }))
    }
    return []
  }, [storesQuery.data])

  // 合并API品种和自定义品种
  const breeds = useMemo(() => {
    return [...customBreeds, ...apiBreeds]
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
    setCustomBreeds((prev) => [newBreed, ...prev])
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
          videos: currentRow.videos ?? [],
          idCardImage: currentRow.idCardImage ?? [],
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
          videos: [],
          idCardImage: [],
          description: '',
          catcafeStatus: defaultStatus || undefined,
          visible: true,
        },
  })

  const onSubmit = async (data: CatForm) => {
    const shouldContinue = continueAddingRef.current
    continueAddingRef.current = false
    setIsSubmitting(true)

    try {
      // 辅助函数：将空字符串转为 null
      const emptyStringToNull = <T,>(value: T | string | undefined): T | null => {
        if (value === '' || value === undefined) return null
        return value as T
      }

      // 构建请求数据（images/videos 为配对对象数组，缩略图随对象原子绑定）
      const requestData: CatCreate | CatUpdate = {
        name: emptyStringToNull(data.name),
        breed: data.breed,
        storeName: emptyStringToNull(data.storeName),
        birthday: data.birthday,
        price: data.price ? Number.parseFloat(data.price) : null,
        images: data.images && data.images.length > 0 ? data.images : null,
        videos: data.videos && data.videos.length > 0 ? data.videos : null,
        idCardImage: data.idCardImage && data.idCardImage.length > 0 ? data.idCardImage : null,
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

      // 触发成功回调（刷新列表）
      onSuccess?.()

      if (shouldContinue) {
        // Reset form but keep dialog open for next entry
        form.reset({
          name: '',
          breed: '',
          storeName: defaultStore || undefined,
          birthday: getTodayString(),
          price: '',
          images: [],
          videos: [],
          idCardImage: [],
          description: '',
          catcafeStatus: defaultStatus || undefined,
          visible: true,
        })
        setAiFilledFields(new Set())
      } else {
        onOpenChange(false)
        // 不调 form.reset()——Dialog 关闭有动画过渡，此时重置会导致表单数值闪回原始值。
        // Dialog 关闭后内容从 DOM 卸载，下次打开时 useForm 会重新初始化。
        setAiFilledFields(new Set())
      }
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

  // 用户主动关闭表单时，若有未保存改动（含已上传的图片/视频）先弹确认框，避免误关丢失
  const handleCloseRequest = () => {
    if (form.formState.isDirty) {
      setConfirmClose(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleResetAI = () => {
    setAiFilledFields(new Set())
    form.reset()
  }

  // 监听对话框打开/关闭：关闭后延迟重置表单状态，避免关闭动画期间闪现原始值
  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        form.reset()
        setAiFilledFields(new Set())
      }, 300)
      setActiveTab('manual')
      return () => clearTimeout(timer)
    }
  }, [open, form, currentRow])

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // 关闭请求（next=false）经拦截器判断是否弹确认；打开请求直接透传
        if (!next) handleCloseRequest()
        else onOpenChange(next)
      }}
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
                isLoadingBreeds={breedsQuery.isLoading}
                apiStatuses={apiStatuses}
                isLoadingStatuses={statusesQuery.isLoading}
                apiStores={apiStores}
                isLoadingStores={storesQuery.isLoading}
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
            isLoadingBreeds={breedsQuery.isLoading}
            apiStatuses={apiStatuses}
            isLoadingStatuses={statusesQuery.isLoading}
            apiStores={apiStores}
            isLoadingStores={storesQuery.isLoading}
          />
        )}

        {/* Dialog Footer - 只在编辑模式或手动填写 Tab 时显示 */}
        {(isUpdate || activeTab === 'manual') && (
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseRequest} disabled={isSubmitting}>
              取消
            </Button>
            {!isUpdate && (
              <Button
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  continueAddingRef.current = true
                  form.handleSubmit(onSubmit)()
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    添加中...
                  </>
                ) : (
                  '保存并继续录入'
                )}
              </Button>
            )}
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
      {/* 放弃未保存更改（含已上传的图片/视频）的确认框 */}
      <ConfirmDialog
        open={confirmClose}
        onOpenChange={setConfirmClose}
        destructive
        title="放弃更改?"
        desc="您有未保存的更改（含已上传的图片/视频），关闭后这些内容将丢失，已上传文件需重新上传。确定放弃吗？"
        confirmText="放弃"
        cancelBtnText="继续编辑"
        handleConfirm={() => {
          setConfirmClose(false)
          onOpenChange(false) // 真正关闭；随后既有 useEffect[!open] 会 form.reset()
        }}
      />
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
                    <BreedCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={isLoadingBreeds ? '加载品种列表中...' : '输入或选择品种'}
                      items={breeds}
                      allowAddNew
                      onAddNew={() => setShowBreedDialog(true)}
                      addNewLabel="添加新品种"
                      className="flex-1"
                      disabled={isLoadingBreeds}
                    />
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

          {/* 图片 / 视频上传：各占整行。置于表单靠上位置，确保对话框打开时即处于可视区内 ——
              此前因位于表单末尾、内容超过 90vh，上传区被挤到折叠线之下，点击落到遮罩层，
              被 Radix 判为“外部点击”导致对话框误关闭、文件选择框无法弹出 */}
          <div className="grid grid-cols-1 gap-4">
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
                        // 返回 {url, thumbnailUrl}，由组件拼成 MediaItem 追加
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

            <FormField
              control={form.control}
              name="videos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>视频</FormLabel>
                  <FormControl>
                    <VideoUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxCount={5}
                      uploadFn={async (files) => {
                        const results = await uploadService.uploadVideos(files)
                        // 返回 {url, thumbnailUrl}（首帧），由组件拼成 MediaItem 追加
                        return results
                          .filter((r) => r.success && r.originalUrl)
                          .map((r) => ({
                            url: r.originalUrl as string,
                            thumbnailUrl: r.thumbnailUrl,
                          }))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 身份卡：小程序详情页展示，单张，复用图片上传（数组结构预留多张） */}
            <FormField
              control={form.control}
              name="idCardImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>身份卡</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      maxCount={1}
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
                    工作状态（猫咖）<span className="text-destructive">*</span>
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
              <FormLabel>客户是否可见</FormLabel>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.watch('visible')}
                  onCheckedChange={(checked) => form.setValue('visible', checked)}
                />
                <label className="text-sm text-muted-foreground">在猫咖小程序中显示</label>
              </div>
            </div>
          </div>

          {/* 图片 / 视频上传已移至表单靠上位置（价格字段之后），见上方 */}
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
