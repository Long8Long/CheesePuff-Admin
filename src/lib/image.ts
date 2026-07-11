/**
 * OSS 图片处理 —— 按使用场景在原图 URL 上拼接 x-oss-process 参数，
 * 由 OSS 边缘节点实时生成对应尺寸 + WebP 转码。原图只存一份，
 * 列表/缩略请求小图、预览请求大图，兼顾清晰度与流量。
 *
 * 与小程序端 src/utils/cat.ts 对齐，后台不再依赖后端返回的独立 thumbnail URL
 * （分辨率不受控导致模糊），统一由 OSS 按需生成。
 *
 * 尺寸按容器物理像素 ×2 出图（覆盖高清屏）：
 *  - thumb   : 列表头像（48px）/ 上传缩略图（80px）→ w_160 覆盖
 *  - preview : 预览大图（全屏 contain）           → w_1080
 *  - origin  : 原图（不处理）
 */
export type ImageSize = 'thumb' | 'preview' | 'origin'

const OSS_PROCESS: Record<Exclude<ImageSize, 'origin'>, string> = {
  thumb: 'image/resize,w_160/quality,q_85/format,webp',
  preview: 'image/resize,w_1080/quality,q_90/format,webp',
}

/**
 * 支持图片处理的图片服务域名（白名单）。
 * 当前为 OSS 直链；迁移 CDN 时在此追加 CDN 域名即可，无需改其它代码。
 */
const IMAGE_HOSTS = [
  'cheesepuff.oss-cn-wulanchabu.aliyuncs.com',
  // 'cdn.cheesepuff.com', // TODO: CDN 上线后启用
]

function isProcessableImage(url: string): boolean {
  if (!url || !/^https?:\/\//.test(url)) return false // 排除 /static/ 本地图、data:
  return IMAGE_HOSTS.some((h) => url.includes(h))
}

/** 在原图 URL 上拼接 OSS 处理参数；非白名单域名（如 mock 占位图）原样返回。 */
export function withImageProcess(
  url: string,
  size: ImageSize = 'thumb'
): string {
  if (size === 'origin' || !isProcessableImage(url)) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}x-oss-process=${OSS_PROCESS[size]}`
}

/**
 * 取媒体项的首选展示地址，默认按「缩略图」档出图，可传 size 切换档位。
 * 只读 url，不再使用 thumbnail 字段（图片缩略图由 OSS 按需生成）。
 */
export function mediaSrc(
  item: { url: string } | null | undefined,
  size: ImageSize = 'thumb'
): string {
  return withImageProcess(item?.url || '', size)
}
