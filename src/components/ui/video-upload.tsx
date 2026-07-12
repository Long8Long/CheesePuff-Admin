import { useState, useRef } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { Upload, X, Video, Loader2, Play } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MediaPreviewDialog } from '@/components/ui/media-preview-dialog'

/**
 * 配对媒体项：视频与其缩略图（首帧）原子绑定。
 * thumbnail 为视频首帧，历史数据可能为 null/缺失，渲染时降级用占位图标。
 * 本类型与 features/cats/models 的 MediaItem 结构兼容，为保持共享 UI 与业务层解耦在此独立声明。
 */
export interface MediaItem {
  url: string
  /** 视频首帧；OSS 无法从视频 URL 生成缩略图，故视频仍需独立首帧 */
  thumbnail?: string | null
}

export interface VideoUploadResult {
  url: string
  thumbnailUrl: string | null
}

type VideoUploadProps = {
  value?: MediaItem[]
  onChange: (items: MediaItem[]) => void
  uploadFn?: (files: File[]) => Promise<VideoUploadResult[]>
  disabled?: boolean
  className?: string
  maxCount?: number
}

/** Internal sortable video thumbnail item for drag-and-drop reordering */
function SortableVideoThumbnail({
  item,
  index,
  onRemove,
  onPreview,
  disabled,
}: {
  item: MediaItem
  index: number
  onRemove: (index: number) => void
  onPreview: (index: number) => void
  disabled: boolean
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.url })

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: transition ?? undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group relative flex h-20 w-20 flex-shrink-0 cursor-grab items-center justify-center overflow-hidden rounded-lg border bg-muted active:cursor-grabbing'
      {...attributes}
      {...listeners}
    >
      {item.thumbnail ? (
        <img
          src={item.thumbnail}
          alt={`视频预览 ${index + 1}`}
          className='h-full w-full object-cover'
          loading='lazy'
        />
      ) : (
        <Video className='h-6 w-6 text-muted-foreground' />
      )}
      {!disabled && (
        <>
          {/* 预览按钮：左上角，始终可见（与图片一致，移动端无 hover） */}
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onPreview(index)
            }}
            className='absolute top-1 left-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80'
            aria-label='预览视频'
          >
            <Play className='h-3 w-3 fill-current' />
          </button>
          {/* 删除按钮：右上角，始终可见（与图片一致，移动端无 hover） */}
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation()
              onRemove(index)
            }}
            className='absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80'
          >
            <X className='h-3 w-3' />
          </button>
        </>
      )}
    </div>
  )
}

/**
 * Video Upload Component / 视频上传组件
 *
 * Features:
 * - Drag and drop upload
 * - Click to select file
 * - Thumbnail preview with fallback icon
 * - Remove video
 * - Drag-and-drop sorting via @dnd-kit (缩略图作为对象属性随视频整体移动)
 * - File type validation (mp4, mov, avi, mkv, webm, flv, wmv)
 * - Size limit 100MB per file
 *
 * 值为 MediaItem[]：每个视频原子绑定自己的缩略图，重排/删除时整对象操作。
 */
export function VideoUpload({
  value = [],
  onChange,
  uploadFn,
  disabled = false,
  className,
  maxCount = 5,
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSorting, setIsSorting] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id))
    setIsSorting(true)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = value.findIndex((i) => i.url === String(active.id))
      const newIndex = value.findIndex((i) => i.url === String(over.id))
      if (oldIndex !== -1 && newIndex !== -1) {
        // 整个 MediaItem 对象移动，thumbnail 自动跟随
        onChange(arrayMove(value, oldIndex, newIndex))
      }
    }
    setActiveId(null)
    setIsSorting(false)
  }

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return

    const availableSlots = maxCount - value.length
    if (availableSlots <= 0) return

    const filesToUpload = files.slice(0, availableSlots)

    setIsUploading(true)
    try {
      if (uploadFn) {
        const results = await uploadFn(filesToUpload)
        // 上传结果拼成 MediaItem：original_url → url，thumbnail_url → thumbnail（首帧）
        const newItems: MediaItem[] = results
          .filter((r) => r.url)
          .map((r) => ({ url: r.url, thumbnail: r.thumbnailUrl ?? null }))
        if (newItems.length > 0) {
          onChange([...value, ...newItems])
          toast.success('上传成功，请及时保存')
        }
      }
    } catch {
      // 服务层已对校验/单文件失败做过具体 toast，这里仅兜底提示重试
      toast.error('视频上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading || isSorting) return
    handleUpload(Array.from(e.dataTransfer.files))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading && !isSorting) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleClick = () => {
    if (!disabled && !isUploading && !isSorting) fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(Array.from(e.target.files || []))
    e.target.value = ''
  }

  const handleRemove = (index: number) => {
    if (!disabled && !isUploading && !isSorting) {
      // 从数组移除对应对象，缩略图随之移除
      onChange(value.filter((_, i) => i !== index))
      toast.success('删除成功，请及时保存')
    }
  }

  // 拖拽预览悬浮层用的媒体项（按 activeId 在 value 中查找）
  const activeItem = activeId ? value.find((i) => i.url === activeId) : null

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type='file'
        accept='video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,video/x-flv,video/x-ms-wmv'
        multiple
        onChange={handleFileChange}
        className='hidden'
        disabled={disabled}
      />

      {/* DndContext 始终渲染，避免 value 变化时重新挂载丢失拖拽状态 */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {value.length < maxCount && (
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'flex min-h-32 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed px-2 py-3 transition-colors',
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50',
              (disabled || isUploading || isSorting) &&
                'cursor-not-allowed opacity-50'
            )}
          >
            {isUploading ? (
              <>
                <Loader2 className='h-10 w-10 animate-spin text-muted-foreground' />
                <p className='mt-2 text-sm text-muted-foreground'>上传中...</p>
              </>
            ) : (
              <>
                <div className='rounded-full bg-muted p-3'>
                  {isDragging ? (
                    <Upload className='h-6 w-6 text-muted-foreground' />
                  ) : (
                    <Video className='h-6 w-6 text-muted-foreground' />
                  )}
                </div>
                <p className='mt-2 text-sm font-medium text-foreground'>
                  点击或拖拽上传视频
                </p>
                <p className='mt-1 text-xs text-muted-foreground'>
                  支持 MP4、MOV、AVI、MKV、WebM 格式，单文件 ≤100MB，最多{' '}
                  {maxCount} 个
                </p>
              </>
            )}
          </div>
        )}

        {value.length > 0 && (
          <div className='mt-3'>
            <SortableContext
              items={value.map((i) => i.url)}
              strategy={rectSortingStrategy}
            >
              <div className='flex flex-wrap gap-2'>
                {value.map((item, index) => (
                  <SortableVideoThumbnail
                    key={item.url}
                    item={item}
                    index={index}
                    onRemove={handleRemove}
                    onPreview={setPreviewIndex}
                    disabled={disabled || isUploading || isSorting}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeItem ? (
                <div className='flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border bg-muted shadow-lg'>
                  {activeItem.thumbnail ? (
                    <img
                      src={activeItem.thumbnail}
                      alt=''
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <Video className='h-6 w-6 text-muted-foreground' />
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </div>
        )}
      </DndContext>

      {/* 视频预览弹窗 */}
      <MediaPreviewDialog
        kind='video'
        open={previewIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewIndex(null)
        }}
        items={value}
        index={previewIndex ?? 0}
        onIndexChange={setPreviewIndex}
      />
    </div>
  )
}
