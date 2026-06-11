import { useState, useRef } from 'react'
import { Upload, X, Video, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface VideoUploadResult {
  url: string
  thumbnailUrl: string | null
}

type VideoUploadProps = {
  value?: string[]
  onChange: (urls: string[]) => void
  uploadFn?: (files: File[]) => Promise<VideoUploadResult[]>
  disabled?: boolean
  className?: string
  maxCount?: number
}

/**
 * Video Upload Component / 视频上传组件
 *
 * Features:
 * - Drag and drop upload
 * - Click to select file
 * - Thumbnail preview with fallback icon
 * - Remove video
 * - File type validation (mp4, mov, avi, mkv, webm, flv, wmv)
 * - Size limit 100MB per file
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return

    const availableSlots = maxCount - value.length
    if (availableSlots <= 0) return

    const filesToUpload = files.slice(0, availableSlots)

    setIsUploading(true)
    try {
      if (uploadFn) {
        const results = await uploadFn(filesToUpload)
        const newUrls = results.map((r) => r.url)
        if (newUrls.length > 0) {
          onChange([...value, ...newUrls])
        }
      }
    } catch (error) {
      // Error handling is done in the service layer with specific messages
      if (error instanceof Error && error.message !== '没有可上传的有效视频文件') {
        // Service-level errors are already toasted, only re-throw unexpected ones
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled || isUploading) return
    handleUpload(Array.from(e.dataTransfer.files))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled && !isUploading) setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleClick = () => {
    if (!disabled && !isUploading) fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleUpload(Array.from(e.target.files || []))
    e.target.value = ''
  }

  const handleRemove = (index: number) => {
    if (!disabled && !isUploading) {
      onChange(value.filter((_, i) => i !== index))
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,video/x-flv,video/x-ms-wmv"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {value.length < maxCount && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'flex aspect-[2/1] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50',
            (disabled || isUploading) && 'cursor-not-allowed opacity-50'
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
                  <Video className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                点击或拖拽上传视频
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                支持 MP4、MOV、AVI、MKV、WebM 格式，单文件 ≤100MB，最多 {maxCount} 个
              </p>
            </>
          )}
        </div>
      )}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((_url, index) => (
            <div
              key={index}
              className="group relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted"
            >
              <Video className="h-6 w-6 text-muted-foreground" />
              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/70 p-0.5 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/90"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
