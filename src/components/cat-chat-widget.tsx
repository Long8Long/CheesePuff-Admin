import { useState } from 'react'
import { PawPrint, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '您好！我是您的猫咪店铺助手，今天有什么可以帮您的吗？',
  timestamp: new Date()
}

const sampleQuestions = [
  '苏州店最近一个月新增了哪些猫？',
  '目前有多少只待售的英短猫？',
  '本月销售额最高的猫咪品种是？',
  '哪些猫咪需要接种疫苗？'
]

export function CatChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // TODO: Replace with actual AI integration
    // Mock response for now
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `这是对您问题的占位符回复："${userMessage.content}"\n\n集成 AI 后，我就能回答您关于猫咪的专业问题了！🐱`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSampleQuestion = (question: string) => {
    setInput(question)
  }

  return (
    <>
      {/* Floating Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            'fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center',
            'rounded-full bg-primary shadow-lg transition-all hover:scale-110 hover:shadow-xl',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label="打开猫咪聊天"
        >
          <PawPrint className="size-6 text-primary-foreground" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <Card
          className={cn(
            'fixed bottom-6 right-6 z-50 flex w-[calc(100%-3rem)] flex-col shadow-xl',
            'max-w-[400px] transition-all sm:w-[380px]'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-8 bg-primary/10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <PawPrint className="size-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-semibold">店铺助手</h3>
                <p className="text-xs text-muted-foreground">猫咪繁育与护理专家 🏪</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 px-4 py-3 h-[400px]">
            <div className="flex flex-col gap-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex max-w-[85%] flex-col gap-1 rounded-lg px-3 py-2 text-sm',
                    message.role === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground'
                      : 'mr-auto bg-muted'
                  )}
                >
                  <p className="break-words whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <span
                    className={cn(
                      'text-xs opacity-70',
                      message.role === 'user'
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              ))}
              {isTyping && (
                <div className="mr-auto flex w-max max-w-[80%] gap-1 rounded-lg bg-muted px-3 py-2">
                  <div className="flex gap-1">
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Sample Questions */}
          {messages.length === 1 && (
            <div className="border-t px-4 py-2">
              <p className="mb-2 text-xs font-medium text-muted-foreground whitespace-nowrap">
                试试问：
              </p>
              <div className="flex flex-col gap-2">
                {sampleQuestions.slice(0, 2).map((question) => (
                  <Button
                    key={question}
                    variant="outline"
                    size="sm"
                    className="h-auto justify-start text-xs py-2 px-3 text-left whitespace-normal leading-relaxed"
                    onClick={() => handleSampleQuestion(question)}
                  >
                    <span className="line-clamp-2">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="flex items-center gap-2 border-t px-4 py-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="询问繁育、护理或店铺相关问题..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              disabled={isTyping}
            />
            <Button
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
            >
              <Send className="size-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}
