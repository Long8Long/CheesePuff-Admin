import { useState } from 'react'
import { Loader2, Clipboard, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { parseCatInfoWithAI } from '@/lib/zhipu-ai'
import type { CatAIOutput } from '../data/ai-schema'

interface CatsAIFillTabProps {
  onAIFill: (data: CatAIOutput) => void
}

export function CatsAIFillTab({ onAIFill }: CatsAIFillTabProps) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAIFill = async () => {
    if (!text.trim()) {
      setError('请输入猫咪的描述信息')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await parseCatInfoWithAI({ text })
      onAIFill(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 填充失败，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText()
      setText(clipboardText)
    } catch {
      setError('无法访问剪贴板，请手动粘贴')
    }
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* 说明文字 */}
      <div className="text-sm text-muted-foreground">
        <p>用一段话描述您的猫咪，AI 会自动提取信息并填充到表单中。</p>
        <p className="mt-1">例如："山东店。短毛金点弟弟 2025/6/8 驱虫疫苗齐全 眼睛大，体格壮，会趴肩膀，喜欢贴人睡觉 在售 3000元 休息中 现猫随时可接。"</p>
      </div>

      {/* 文本输入区 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">📝 描述您的猫咪</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="猫咪的名称、品种、年龄、价格、性格等信息..."
          rows={5}
          className="resize-none"
          disabled={isLoading}
        />
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePaste}
          disabled={isLoading}
        >
          <Clipboard className="mr-2 h-4 w-4" />
          从剪贴板粘贴
        </Button>
        <Button
          type="button"
          onClick={handleAIFill}
          disabled={isLoading || !text.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              AI 正在解析...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              AI 智能填充
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
