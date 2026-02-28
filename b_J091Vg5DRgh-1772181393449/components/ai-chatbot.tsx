'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Accessibility,
  MapPin,
  Route,
  Search,
  Sparkles,
  GripHorizontal,
  Minus,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

function getMessageText(
  parts: Array<{ type: string; text?: string; [key: string]: any }>
): string {
  if (!parts || !Array.isArray(parts)) return ''
  return parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const rendered: React.ReactNode[] = []

  lines.forEach((line, i) => {
    let processed: React.ReactNode = line

    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g)
      processed = parts.map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-semibold">
            {part}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        )
      )
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      rendered.push(
        <div key={i} className="flex gap-1.5 ml-1">
          <span className="text-primary mt-0.5 shrink-0">{'•'}</span>
          <span>{typeof processed === 'string' ? processed.slice(2) : processed}</span>
        </div>
      )
    } else if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)?.[1]
      rendered.push(
        <div key={i} className="flex gap-1.5 ml-1">
          <span className="text-primary font-medium shrink-0">{num}.</span>
          <span>{typeof processed === 'string' ? processed.replace(/^\d+\.\s/, '') : processed}</span>
        </div>
      )
    } else if (line.trim() === '') {
      rendered.push(<div key={i} className="h-1.5" />)
    } else {
      rendered.push(
        <div key={i}>{processed}</div>
      )
    }
  })

  return rendered
}

const QUICK_ACTIONS = [
  {
    icon: Search,
    label: 'Найти место',
    prompt: 'Найди кафе с доступной средой в Таганроге',
  },
  {
    icon: Accessibility,
    label: 'Доступность',
    prompt: 'Какие есть доступные больницы для людей на инвалидной коляске в Ростовской области?',
  },
  {
    icon: Route,
    label: 'Маршрут',
    prompt: 'Как добраться от Главного вокзала до парка Горького пешком? Какой маршрут самый доступный?',
  },
  {
    icon: MapPin,
    label: 'Рядом',
    prompt: 'Какие аптеки с пандусами есть рядом с центром города?',
  },
]

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; text: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Track scroll position
  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    function handleScroll() {
      if (!container) return
      const { scrollTop, scrollHeight, clientHeight } = container
      setShowScrollTop(scrollTop > 100)
      setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 100)
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => container.removeEventListener('scroll', handleScroll)
  }, [messages, isOpen])

  function scrollToTop() {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isLoading) return
    const text = inputValue.trim()
    setInputValue('')

    const userMsg = { id: `user-${Date.now()}`, role: 'user' as const, text }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.text,
          }))
        }),
      })
      const data = await res.json()
      const assistantText = data?.choices?.[0]?.message?.content
        || data?.content
        || data?.text
        || (typeof data === 'string' ? data : 'Извините, произошла ошибка.')

      setMessages(prev => [...prev, {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: typeof assistantText === 'string' ? assistantText : JSON.stringify(assistantText),
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'Извините, произошла ошибка при обработке запроса. Попробуйте позже.',
      }])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, messages])

  function handleQuickAction(prompt: string) {
    if (isLoading) return
    setInputValue(prompt)
    setTimeout(() => {
      const userMsg = { id: `user-${Date.now()}`, role: 'user' as const, text: prompt }
      setMessages(prev => [...prev, userMsg])
      setIsLoading(true)
      setInputValue('')

      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.text,
          }))
        }),
      })
        .then(res => res.json())
        .then(data => {
          const assistantText = data?.choices?.[0]?.message?.content
            || data?.content
            || data?.text
            || (typeof data === 'string' ? data : 'Извините, произошла ошибка.')

          setMessages(prev => [...prev, {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            text: typeof assistantText === 'string' ? assistantText : JSON.stringify(assistantText),
          }])
        })
        .catch(() => {
          setMessages(prev => [...prev, {
            id: `error-${Date.now()}`,
            role: 'assistant',
            text: 'Извините, произошла ошибка при обработке запроса.',
          }])
        })
        .finally(() => setIsLoading(false))
    }, 0)
  }

  return (
    <>
      {/* Floating open button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false) }}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
          aria-label="Открыть AI-помощник"
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6" />
            <Sparkles className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-accent" />
          </div>
        </button>
      )}

      {/* Chat widget when open */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col w-[380px] max-w-[calc(100vw-2.5rem)] rounded-2xl border border-border bg-card shadow-2xl overflow-hidden"
          style={{ height: isMinimized ? 'auto' : '560px', maxHeight: isMinimized ? 'auto' : 'calc(100dvh - 6rem)' }}
        >
          {/* Header with drag handle - ALWAYS visible with close button */}
          <div className="flex items-center gap-2 px-3 py-2.5 bg-primary text-primary-foreground shrink-0">
            {/* Drag handle indicator */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15 shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold leading-tight truncate">
                  AI-помощник
                </h3>
                <p className="text-[10px] text-primary-foreground/70 leading-tight truncate">
                  Доступная среда Ростовской области
                </p>
              </div>
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="shrink-0 rounded-lg p-1.5 hover:bg-primary-foreground/15 transition-colors"
              aria-label={isMinimized ? 'Развернуть чат' : 'Свернуть чат'}
            >
              {isMinimized ? (
                <GripHorizontal className="h-4 w-4" />
              ) : (
                <Minus className="h-4 w-4" />
              )}
            </button>

            {/* Close button - ALWAYS visible, large tap target */}
            <button
              onClick={() => setIsOpen(false)}
              className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
              aria-label="Закрыть чат"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content - hidden when minimized */}
          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="relative flex-1 overflow-hidden">
                <div ref={messagesContainerRef} className="h-full overflow-y-auto px-4 py-3 gap-3 flex flex-col">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center py-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                      <Accessibility className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground text-center mb-1">
                      Привет! Я AI-помощник
                    </p>
                    <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[260px] mb-4">
                      Помогу найти доступные места, построить маршрут и узнать об
                      оснащённости зданий в Ростовской области
                    </p>

                    {/* Quick actions */}
                    <div className="grid grid-cols-2 gap-2 w-full">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action.label}
                          onClick={() => handleQuickAction(action.prompt)}
                          className="flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-2.5 text-left text-xs text-foreground hover:bg-secondary transition-colors"
                        >
                          <action.icon className="h-4 w-4 text-primary shrink-0" />
                          <span className="font-medium">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => {
                  const isUser = message.role === 'user'
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full ${
                          isUser
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {isUser ? (
                          <User className="h-3.5 w-3.5" />
                        ) : (
                          <Bot className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                          isUser
                            ? 'bg-accent text-accent-foreground rounded-tr-sm'
                            : 'bg-secondary text-secondary-foreground rounded-tl-sm'
                        }`}
                      >
                        {isUser ? (
                          <span>{message.text}</span>
                        ) : (
                          <div className="space-y-0.5">{renderMarkdown(message.text)}</div>
                        )}
                      </div>
                    </div>
                  )
                })}

                {isLoading && (
                  <div className="flex gap-2">
                    <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary px-3.5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">
                          Анализирую...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

                {/* Scroll to top button */}
                {showScrollTop && (
                  <button
                    onClick={scrollToTop}
                    className="absolute left-1/2 top-2 z-10 -translate-x-1/2 flex items-center gap-1 rounded-full border border-border bg-card/95 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-md backdrop-blur-sm transition-all hover:bg-secondary hover:text-foreground"
                    aria-label="Прокрутить вверх"
                  >
                    <ArrowUp className="h-3 w-3" />
                    Наверх
                  </button>
                )}

                {/* Scroll to bottom button */}
                {showScrollBottom && messages.length > 2 && (
                  <button
                    onClick={scrollToBottom}
                    className="absolute left-1/2 bottom-2 z-10 -translate-x-1/2 flex items-center gap-1 rounded-full border border-border bg-card/95 px-3 py-1.5 text-[11px] font-medium text-muted-foreground shadow-md backdrop-blur-sm transition-all hover:bg-secondary hover:text-foreground"
                    aria-label="Прокрутить вниз"
                  >
                    <ArrowDown className="h-3 w-3" />
                    Вниз
                  </button>
                )}
              </div>

              {/* Input area */}
              <div className="border-t border-border bg-card px-3 py-2.5 shrink-0">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Спросите о доступности..."
                    className="h-9 text-sm border-border bg-secondary/50 rounded-xl focus-visible:ring-primary/30"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
                  AI анализирует все места на карте Ростовской области
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}
