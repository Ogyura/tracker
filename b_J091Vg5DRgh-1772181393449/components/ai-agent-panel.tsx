'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Send,
  Bot,
  User,
  X,
  Utensils,
  GraduationCap,
  Drama,
  Trees,
  MapPin,
  Sparkles,
  MessageCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Pre-built Q&A                                                      */
/* ------------------------------------------------------------------ */
interface QA {
  question: string
  answer: string
}

interface QACategory {
  id: string
  label: string
  icon: React.ElementType
  items: QA[]
}

const QA_CATEGORIES: QACategory[] = [
  {
    id: 'restaurants',
    label: 'Рестораны',
    icon: Utensils,
    items: [
      {
        question: 'Лучший ресторан для колясочников?',
        answer:
          '**Ресторан "Паризьен"** (пер. Газетный, 47) -- рейтинг 4.8.\n\nПодъёмник, широкие двери, доступный санузел, меню шрифтом Брайля, допускает собак-проводников.\n\nТакже:\n- **"Онегин"** (4.7) -- пандус, Брайль\n- **"Рис"** (4.6) -- безбарьерный вход\n- **"Тихий Дон"** (4.5) -- пандус на набережной',
      },
      {
        question: 'Где есть меню шрифтом Брайля?',
        answer:
          'Рестораны с меню шрифтом Брайля:\n\n1. **"Паризьен"** -- полное меню Брайлем + собаки-проводники\n2. **"Рис"** -- азиатская кухня, Брайль\n3. **"Онегин"** -- русская кухня, Брайль\n4. **Кафе "Антресоль"** -- Брайль + картинки',
      },
      {
        question: 'Лучший ресторан для глухих?',
        answer:
          '**Ресторан "Нью-Йорк"** (ул. Б. Садовая, 100) -- рейтинг 4.3.\n\nЛифт, кнопка вызова персонала, обученный персонал.\n\nДругие варианты:\n- **"Паризьен"** (4.8) -- подъёмник + обученный персонал\n- **"Онегин"** (4.7) -- обученный персонал',
      },
      {
        question: 'Ресторан с тихой зоной?',
        answer:
          'Заведения с тихими зонами:\n\n- **"Рыба-Мечта"** -- спокойная атмосфера, низкая стойка\n- **"Паризьен"** -- камерный интерьер\n- **Кафе "Подсолнух"** -- спокойная обстановка\n\nСенсорные комнаты есть в **Театре кукол** и **Ростовском зоопарке**.',
      },
    ],
  },
  {
    id: 'education',
    label: 'Образование',
    icon: GraduationCap,
    items: [
      {
        question: 'Лучшее учебное заведение?',
        answer:
          '**Школа-интернат N28** (рейтинг 4.5) -- лифт, пандус, подъёмник, тактильная плитка, индукционная петля, Брайль, сенсорная комната.\n\nТакже:\n- **Донская публичная библиотека** (4.6) -- Брайль, аудиогид\n- **ДГТУ** (4.2) -- лифты, подъёмник, сенсорная комната\n- **Школа N80** (4.4) -- инклюзивная среда',
      },
      {
        question: 'Вузы с лучшей доступностью?',
        answer:
          '**ДГТУ** (пл. Гагарина, 1) -- рейтинг 4.2, 13 тегов доступности.\n\nЛифт, пандус, подъёмник, тактильная плитка, индукционная петля, сенсорная комната.\n\n**ЮФУ** (ул. Б. Садовая, 105) -- рейтинг 4.0, 11 тегов.\nЛифт, пандус, подъёмник, тактильная плитка.',
      },
      {
        question: 'Библиотеки для незрячих?',
        answer:
          '**Донская публичная библиотека** (ул. Пушкинская, 175А) -- рейтинг 4.6.\n\nБрайль, аудиогид, крупный шрифт, говорящий лифт, собаки-проводники.\n\n**Библиотека им. Горького** (ул. Пушкинская, 175) -- рейтинг 4.3.\nРабочее место для незрячих, Брайль, аудиогид.',
      },
    ],
  },
  {
    id: 'theaters',
    label: 'Театры и кино',
    icon: Drama,
    items: [
      {
        question: 'Лучший театр для инвалидов?',
        answer:
          '**Филармония** (ул. Б. Садовая, 170) -- рейтинг 4.7.\n\nЛифт, пандус, подъёмник, индукционная петля, места для колясок, FM-система.\n\nТакже:\n- **Ростовский музыкальный театр** (4.6) -- тифлокомментирование\n- **Театр им. М. Горького** (4.5) -- сурдоперевод\n- **Театр кукол** (4.4) -- сенсорная комната',
      },
      {
        question: 'Где тифлокомментирование?',
        answer:
          'Театры:\n1. **Ростовский музыкальный театр** (4.6) -- тифлокомментирование + FM-система\n2. **Театр им. М. Горького** (4.5) -- на отдельных спектаклях\n\nКинотеатры:\n1. **"СИНЕМАПАРК"** (4.5)\n2. **"Пять Звёзд"** (4.6) -- тифлокомментирование + FM-система',
      },
      {
        question: 'Кинотеатры с субтитрами?',
        answer:
          '1. **"Пять Звёзд"** (4.6) -- субтитры, FM-система, тифлокомментирование\n2. **"СИНЕМАПАРК"** (4.5) -- субтитры, тифлокомментирование\n3. **"Большой"** (4.3) -- субтитры, индукционная петля\n4. **"Ростов"** (4.1) -- субтитры\n5. **"Чарли"** (4.2) -- субтитры на вечерних сеансах',
      },
      {
        question: 'Театры с сурдопереводом?',
        answer:
          '1. **Театр им. М. Горького** (4.5) -- сурдоперевод + индукционная петля\n2. **Ростовский музыкальный театр** (4.6) -- сурдоперевод + FM-система\n\nУточняйте расписание сурдопереводимых спектаклей по телефону.',
      },
    ],
  },
  {
    id: 'parks',
    label: 'Парки',
    icon: Trees,
    items: [
      {
        question: 'Лучший парк для колясочников?',
        answer:
          '**Набережная реки Дон** (рейтинг 4.5) -- ровные дорожки, пандусы, поручни, тактильная плитка.\n\nТакже:\n- **Ростовский зоопарк** (4.3) -- пандусы, такт��льный зоопарк, сенсорная комната\n- **Парк им. Горького** (4.2) -- тактильные модели\n- **Парк "Левобережный"** (4.1) -- асфальтированные дорожки',
      },
      {
        question: 'Парки с тактильными моделями?',
        answer:
          '1. **Парк им. Горького** -- тактильные модели, аудиогид, контрастная разметка\n2. **Ростовский зоопарк** -- тактильный зоопарк, рельефные модели\n3. **Ботанический сад ЮФУ** -- аудиогид на экскурсиях\n\nВ музеях:\n- **Музей изобразительных искусств** -- тактильные модели + Брайль',
      },
      {
        question: 'Тихие зоны в парках?',
        answer:
          '1. **Парк им. Горького** -- сенсорная зона, тихие аллеи\n2. **Ростовский зоопарк** -- зона тишины + сенсорная комната\n3. **Парк "Левобережный"** -- тихие дорожки\n4. **Парк им. Островского** -- спокойные аллеи\n5. **Ботанический сад ЮФУ** -- природная тишина',
      },
    ],
  },
  {
    id: 'streets',
    label: 'Улицы',
    icon: MapPin,
    items: [
      {
        question: 'Самые доступные улицы?',
        answer:
          '1. **ул. Большая Садовая** -- ровные тротуары, тактильная плитка, множество доступных заведений\n2. **Набережная (ул. Береговая)** -- полностью ровная, пандусы, поручни\n3. **пр. Будённовский** (центр) -- широкие тротуары\n4. **ул. Пушкинская** -- пешеходная зона, ровное покрытие',
      },
      {
        question: 'Опасные участки для коляски?',
        answer:
          '1. **ул. Станиславского у рынка** -- узкие тротуары, нет пандусов\n2. **Привокзальная площадь** -- сложная навигация\n3. **ул. Текучёва** (запад) -- неровное покрытие\n4. **пр. Стачки** -- нет занижений бордюров\n5. **пер. Газетный** -- крутой уклон',
      },
      {
        question: 'Улицы с тактильной плиткой?',
        answer:
          '1. **ул. Большая Садовая** -- на переходах\n2. **Театральная площадь** -- полная тактильная навигация\n3. **пр. Будённовский** -- на переходах у ЦУМа\n4. **пр. Ворошиловский** -- у парка Горького\n5. **Привокзальная площадь** -- подземный переход\n\nВнутри зданий: МФЦ, вокзал, аэропорт Платов, зоопарк.',
      },
      {
        question: 'Где нет звуковых светофоров?',
        answer:
          '**Установлены** на:\n- Переход у ЦУМа (Б. Садовая / Будённовский)\n- Переход у парка Горького\n- Театральная площадь\n- Главный вокзал\n\n**Отсутствуют** на:\n- ул. Текучёва\n- пр. Стачки\n- ул. Красноармейская (юг)\n- ул. Социалистическая (кроме центра)',
      },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Markdown renderer                                                  */
/* ------------------------------------------------------------------ */
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const rendered: React.ReactNode[] = []

  lines.forEach((line, i) => {
    let processed: React.ReactNode = line

    if (line.includes('**')) {
      const parts = line.split(/\*\*(.+?)\*\*/g)
      processed = parts.map((part, j) =>
        j % 2 === 1 ? (
          <strong key={j} className="font-semibold text-foreground">
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
          <span className="text-primary mt-0.5 shrink-0 text-[10px]">{'●'}</span>
          <span>{typeof processed === 'string' ? processed.slice(2) : processed}</span>
        </div>
      )
    } else if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\./)?.[1]
      rendered.push(
        <div key={i} className="flex gap-1.5 ml-1">
          <span className="text-primary font-semibold shrink-0">{num}.</span>
          <span>
            {typeof processed === 'string' ? processed.replace(/^\d+\.\s/, '') : processed}
          </span>
        </div>
      )
    } else if (line.trim() === '') {
      rendered.push(<div key={i} className="h-1.5" />)
    } else {
      rendered.push(<div key={i}>{processed}</div>)
    }
  })

  return rendered
}

/* ------------------------------------------------------------------ */
/*  Message type                                                       */
/* ------------------------------------------------------------------ */
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
interface AIAgentPanelProps {
  open: boolean
  onOpen: () => void
  onClose: () => void
}

export default function AIAgentPanel({ open, onOpen, onClose }: AIAgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Здравствуйте! Я AI-ассистент ДоступРостов. Помогу найти доступные места в городе. Выберите тему или задайте свой вопрос.',
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [showQuickQuestions, setShowQuickQuestions] = useState(true)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesTopRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

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
  }, [messages])

  function scrollToTop() {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function findAnswer(query: string): string {
    const q = query.toLowerCase()
    for (const cat of QA_CATEGORIES) {
      for (const item of cat.items) {
        const keywords = item.question.toLowerCase().split(/\s+/)
        const matchCount = keywords.filter((k) => k.length > 3 && q.includes(k)).length
        if (matchCount >= 2) return item.answer
      }
    }

    if (q.includes('ресторан') || q.includes('кафе') || q.includes('еда'))
      return 'По ресторанам рекомендую: **"Паризьен"** (4.8), **"Онегин"** (4.7), **"Рис"** (4.6). Выберите категорию "Рестораны" для подробностей.'
    if (q.includes('театр') || q.includes('кино') || q.includes('фильм'))
      return 'По театрам: **Филармония** (4.7), **Музыкальный театр** (4.6), **Театр Горького** (4.5). Выберите "Театры и кино" для деталей.'
    if (q.includes('парк') || q.includes('сквер') || q.includes('гулять'))
      return 'Лучшие парки: **Набережная Дона** (4.5), **Зоопарк** (4.3), **Парк Горького** (4.2). Выберите "Парки" для подробностей.'
    if (q.includes('школ') || q.includes('универ') || q.includes('учеб') || q.includes('библиотек'))
      return 'По образованию: **Школа-интернат N28** (4.5), **ДГТУ** (4.2), **Донская библиотека** (4.6). Выберите "Образование".'
    if (q.includes('улиц') || q.includes('тротуар') || q.includes('дорог'))
      return 'Самые доступные: **Б. Садовая**, **Набережная**, **пр. Будённовский**. Выберите "Улицы" для подробностей.'

    return 'К сожалению, у меня нет точного ответа. Попробуйте выбрать одну из категорий ниже или переформулируйте вопрос.'
  }

  function simulateTyping(question: string, answer: string) {
    const userMsg: Message = {
      id: Date.now() + '-user',
      role: 'user',
      content: question,
    }

    const typingMsg: Message = {
      id: Date.now() + '-typing',
      role: 'assistant',
      content: '',
      isTyping: true,
    }

    setMessages((prev) => [...prev, userMsg, typingMsg])
    setShowQuickQuestions(false)

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === typingMsg.id ? { ...m, content: answer, isTyping: false } : m
        )
      )
      setShowQuickQuestions(true)
      setSelectedCategoryId(null)
    }, 600)
  }

  function handleQuestionClick(qa: QA) {
    simulateTyping(qa.question, qa.answer)
  }

  function handleCategoryClick(catId: string) {
    setSelectedCategoryId((prev) => (prev === catId ? null : catId))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return
    const answer = findAnswer(inputValue)
    simulateTyping(inputValue, answer)
    setInputValue('')
  }

  const selectedCat = QA_CATEGORIES.find((c) => c.id === selectedCategoryId)

  return (
    <>
      {/* Floating toggle button */}
      {!open && (
        <button
          onClick={onOpen}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/30 active:scale-95"
          aria-label="Открыть чат-бот"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat window */}
      <div
        className={`fixed bottom-5 right-5 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/10 transition-all duration-300 ${
          open
            ? 'w-[380px] max-w-[calc(100vw-40px)] h-[600px] max-h-[calc(100dvh-40px)] opacity-100 scale-100 translate-y-0'
            : 'w-[380px] h-[600px] opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Чат-бот ДоступРостов"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold leading-tight">AI-Ассистент</h2>
              <p className="text-[11px] leading-tight opacity-80">ДоступРостов</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/15"
            onClick={onClose}
            aria-label="Закрыть чат-бот"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="h-full overflow-y-auto px-3 py-3"
          >
            <div ref={messagesTopRef} />
            <div className="space-y-3">
            {messages.map((msg) => {
              const isUser = msg.role === 'user'

              if (msg.isTyping) {
                return (
                  <div key={msg.id} className="flex gap-2">
                    <div className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-secondary/60 px-3 py-2.5">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )
              }

              return (
                <div key={msg.id} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full ${
                      isUser ? 'bg-accent/15' : 'bg-primary/10'
                    }`}
                  >
                    {isUser ? (
                      <User className="h-3.5 w-3.5 text-accent" />
                    ) : (
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2.5 text-[12.5px] leading-relaxed ${
                      isUser
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-secondary/60 text-foreground rounded-tl-sm'
                    }`}
                  >
                    {isUser ? (
                      <span>{msg.content}</span>
                    ) : (
                      <div className="space-y-0.5">{renderMarkdown(msg.content)}</div>
                    )}
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
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

        {/* Quick questions area */}
        {showQuickQuestions && (
          <div className="border-t border-border bg-secondary/20 px-3 py-2.5">
            {/* Category chips */}
            {!selectedCategoryId && (
              <div className="space-y-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Выберите тему
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QA_CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary hover:border-primary/30"
                      >
                        <Icon className="h-3 w-3 text-primary" />
                        {cat.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Questions for selected category */}
            {selectedCat && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <selectedCat.icon className="h-3 w-3 text-primary" />
                    <span className="text-[11px] font-semibold text-foreground">{selectedCat.label}</span>
                  </div>
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Все темы
                  </button>
                </div>
                <div className="space-y-1 max-h-[120px] overflow-y-auto">
                  {selectedCat.items.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuestionClick(qa)}
                      className="flex items-start gap-1.5 w-full rounded-lg px-2 py-1.5 text-left text-[11px] text-foreground transition-colors hover:bg-secondary leading-snug"
                    >
                      <Sparkles className="h-3 w-3 mt-0.5 shrink-0 text-primary/60" />
                      <span>{qa.question}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Input bar */}
        <div className="border-t border-border p-3 bg-card">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Задайте вопрос..."
              className="flex-1 h-9 text-sm rounded-full border-border bg-secondary/40 px-4 focus-visible:ring-primary/30"
            />
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shrink-0"
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
