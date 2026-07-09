import { useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

export type MediaKind = 'image' | 'video'

export interface MediaPreviewItem {
  url: string
  thumbnail?: string | null
}

interface MediaPreviewDialogProps {
  /** 受控打开状态 */
  open: boolean
  onOpenChange: (open: boolean) => void
  /** 媒体列表（用于上一张/下一张切换） */
  items: MediaPreviewItem[]
  /** 当前预览的索引 */
  index: number
  onIndexChange: (index: number) => void
  /** 媒体类型：图片或视频 */
  kind: MediaKind
}

/**
 * 媒体预览弹窗
 *
 * 用于 ImageUpload / VideoUpload 缩略图点击预览：
 * - 图片：展示原图（<img>），自适应缩放
 * - 视频：原生 <video controls autoPlay> 播放
 * - 支持上一张/下一张切换（按钮 + 左右方向键）
 * - 暗色背景突出媒体内容，关闭后自动暂停视频
 */
export function MediaPreviewDialog({
  open,
  onOpenChange,
  items,
  index,
  onIndexChange,
  kind,
}: MediaPreviewDialogProps) {
  const total = items.length
  const currentItem = items[index]

  const goToPrev = useCallback(() => {
    if (total <= 1) return
    onIndexChange((index - 1 + total) % total)
  }, [index, total, onIndexChange])

  const goToNext = useCallback(() => {
    if (total <= 1) return
    onIndexChange((index + 1) % total)
  }, [index, total, onIndexChange])

  // 方向键切换，Esc 由 Radix Dialog 处理
  useEffect(() => {
    if (!open || total <= 1) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, total, goToPrev, goToNext])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 内容容器：占满视口、透明无框，媒体直接显示在遮罩层之上。
          DialogContent 内部已渲染 DialogOverlay（半透明遮罩 + 点空白关闭），
          这里把 Content 自身做成透明层，不再有独立黑色舞台。 */}
      <DialogContent
        showCloseButton
        className='flex h-[100dvh] w-[100vw] max-w-none items-center justify-center gap-0 overflow-hidden rounded-none border-none bg-transparent p-0 shadow-none [&>button[data-slot=dialog-close]]:z-20 [&>button[data-slot=dialog-close]]:rounded-full [&>button[data-slot=dialog-close]]:bg-white/10 [&>button[data-slot=dialog-close]]:text-white [&>button[data-slot=dialog-close]]:backdrop-blur [&>button[data-slot=dialog-close]]:hover:bg-white/20'
      >
        {/* 屏幕阅读器可见的标题，视觉隐藏 */}
        <DialogTitle className='sr-only'>
          {kind === 'image' ? '图片预览' : '视频预览'}
        </DialogTitle>

        {/* 媒体主体：在视口内 contain 缩放，尽可能大且完整可见 */}
        <div className='flex max-h-[100dvh] max-w-[100vw] items-center justify-center'>
          {currentItem ? (
            kind === 'image' ? (
              <img
                src={currentItem.url}
                alt='预览'
                className='max-h-[100dvh] max-w-[100vw] object-contain'
              />
            ) : (
              <video
                key={currentItem.url}
                src={currentItem.url}
                controls
                autoPlay
                className='max-h-[100dvh] max-w-[100vw]'
              />
            )
          ) : null}
        </div>

        {/* 上一张 / 下一张：相对视口边缘，不在媒体内 */}
        {total > 1 && (
          <>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              className='absolute top-1/2 left-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20'
              aria-label='上一张'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
            <button
              type='button'
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              className='absolute top-1/2 right-2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20'
              aria-label='下一张'
            >
              <ChevronRight className='h-6 w-6' />
            </button>
            <span className='absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white backdrop-blur'>
              {index + 1} / {total}
            </span>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
