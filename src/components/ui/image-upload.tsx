import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
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

export interface UploadResult {
  url: string
  thumbnailUrl: string
}

type ImageUploadProps = {
  value?: string[]
  onChange: (urls: string[]) => void
  uploadFn?: (files: File[]) => Promise<UploadResult[]>
  disabled?: boolean
  className?: string
  maxCount?: number
}

/** Internal sortable thumbnail item for drag-and-drop reordering */
function SortableImageThumbnail({
  url,
  index,
  onRemove,
  disabled,
}: {
  url: string
  index: number
  onRemove: (index: number) => void
  disabled: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url })

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: transition ?? undefined,
    opacity: isDragging ? 0.5 : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group h-20 w-20 flex-shrink-0 cursor-grab overflow-hidden rounded-lg border active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      <img
        src={url}
        alt={`Thumbnail ${index + 1}`}
        className="h-full w-full object-cover"
      />
      {!disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(index)
          }}
          className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/90"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}

/**
 * Image Upload Component
 *
 * Features:
 * - Drag and drop upload
 * - Click to select file
 * - Image preview with thumbnail support
 * - Remove image
 * - Drag-and-drop sorting via @dnd-kit
 * - Custom upload function support
 * - File type validation (jpg, jpeg, png, webp, gif)
 */
export function ImageUpload({
  value = [],
  onChange,
  uploadFn,
  disabled = false,
  className,
  maxCount = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSorting, setIsSorting] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
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
      const oldIndex = value.indexOf(String(active.id))
      const newIndex = value.indexOf(String(over.id))
      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(value, oldIndex, newIndex))
      }
    }
    setActiveId(null)
    setIsSorting(false)
  }

  // Simulated upload API - Replace with real API later
  const simulateUpload = async (file: File): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create object URL for preview (in real app, this would be the URL returned from API)
    const url = URL.createObjectURL(file)
    return url
  }

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    return validTypes.includes(file.type)
  }

  // Handle batch upload of multiple files
  const handleBatchUpload = async (files: File[]) => {
    // Validate all files first
    const validFiles = files.filter((file) => {
      if (!validateFile(file)) {
        alert(`文件 "${file.name}" 格式不支持，仅支持 JPG、PNG、WebP、GIF 格式`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Check max count
    const availableSlots = maxCount - value.length
    if (availableSlots <= 0) {
      alert(`最多只能上传 ${maxCount} 张图片`)
      return
    }

    const filesToUpload = validFiles.slice(0, availableSlots)
    if (validFiles.length > availableSlots) {
      alert(`只能再上传 ${availableSlots} 张图片，已忽略多余的 ${validFiles.length - availableSlots} 个文件`)
    }

    setIsUploading(true)
    try {
      let newUrls: string[] = []

      if (uploadFn) {
        // Use custom upload function (batch)
        const results = await uploadFn(filesToUpload)
        newUrls = results
          .filter((r) => r.thumbnailUrl || r.url)
          .map((r) => r.thumbnailUrl || r.url || '')
      } else {
        // Fallback to simulated upload (still batch for consistency)
        const results = await Promise.all(
          filesToUpload.map(async (file) => {
            const url = await simulateUpload(file)
            return url
          })
        )
        newUrls = results
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls])
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('图片上传失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled || isUploading || isSorting) return

    const files = Array.from(e.dataTransfer.files)
    handleBatchUpload(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading && !isSorting) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleClick = () => {
    if (!disabled && !isUploading && !isSorting) {
      fileInputRef.current?.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleBatchUpload(files)
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  const handleRemove = (index: number) => {
    if (!disabled && !isUploading && !isSorting) {
      const newValue = value.filter((_, i) => i !== index)
      onChange(newValue)
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Upload area - always visible (only show when not reaching max) */}
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
            (disabled || isUploading || isSorting) && 'cursor-not-allowed opacity-50'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">上传中...</p>
            </>
          ) : (
            <>
              <div className="rounded-full bg-muted p-3">
                {isDragging ? (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                点击或拖拽上传
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                支持 JPG、PNG、WebP、GIF 格式，最多 {maxCount} 张
              </p>
            </>
          )}
        </div>
      )}

      {/* Thumbnail previews with drag-and-drop sorting */}
      {value.length > 0 && (
        <div className="mt-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={value} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap gap-2">
                {value.map((url, index) => (
                  <SortableImageThumbnail
                    key={url}
                    url={url}
                    index={index}
                    onRemove={handleRemove}
                    disabled={disabled || isUploading || isSorting}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <div className="h-20 w-20 overflow-hidden rounded-lg border shadow-lg">
                  <img
                    src={activeId}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  )
}
