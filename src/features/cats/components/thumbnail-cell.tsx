import { useState } from 'react'
import { Image as ImageIcon } from 'lucide-react'
import type { Cat } from '../models'
import { mediaSrc } from '@/lib/image'

/**
 * 列表照片列：取首图缩略图（OSS 按需出图），加载失败/无图回退到图标占位。
 * key=url：切换行数据时重置错误态，避免错误占位粘连到新图。
 */
export function ThumbnailCell({ cat }: { cat: Cat }) {
  const firstImage = cat.images?.[0]
  const src = firstImage ? mediaSrc(firstImage, 'thumb') : ''
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <div className='flex size-12 items-center justify-center overflow-hidden rounded-md bg-muted'>
        <ImageIcon className='size-5 text-muted-foreground' />
      </div>
    )
  }
  return (
    <div className='size-12 overflow-hidden rounded-md bg-muted'>
      <img
        key={src}
        src={src}
        alt={cat.name ?? ''}
        className='size-full object-cover'
        loading='lazy'
        onError={() => setErrored(true)}
      />
    </div>
  )
}
