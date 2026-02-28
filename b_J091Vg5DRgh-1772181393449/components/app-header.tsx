'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Accessibility, Plus, List, Map as MapIcon, Menu, LogIn,
  User, LogOut, Sun, Moon, LayoutDashboard, Bot, Settings,
} from 'lucide-react'

interface AppHeaderProps {
  placeCount: number
  view: 'map' | 'list' | 'dashboard'
  onSetView: (view: 'map' | 'list' | 'dashboard') => void
  onAddPlace: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
  onOpenAuth: () => void
  onOpenProfile: () => void
  onOpenAgent: () => void
  onOpenSettings: () => void
}

export default function AppHeader({
  placeCount,
  view,
  onSetView,
  onAddPlace,
  onToggleSidebar,
  sidebarOpen,
  onOpenAuth,
  onOpenProfile,
  onOpenAgent,
  onOpenSettings,
}: AppHeaderProps) {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : ''

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-3 md:px-4">
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 md:hidden"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Accessibility className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold leading-tight text-card-foreground">ДоступРостов</h1>
            <p className="text-[10px] leading-tight text-muted-foreground">Навигация без барьеров</p>
          </div>
        </div>

        <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
          {placeCount} мест
        </Badge>
      </div>

      <div className="flex items-center gap-1.5">
        {/* View switcher */}
        <div className="flex rounded-lg border border-border overflow-hidden">
          {([
            { key: 'map' as const, icon: MapIcon, label: 'Карта' },
            { key: 'list' as const, icon: List, label: 'Список' },
            { key: 'dashboard' as const, icon: LayoutDashboard, label: 'Дашборд' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => onSetView(key)}
              className={`flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium transition-colors ${
                view === key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/80'
              }`}
              aria-label={label}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Agent button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenAgent}
          className="h-8 text-xs gap-1.5"
          aria-label="Открыть AI-ассистент"
        >
          <Bot className="h-3.5 w-3.5 text-primary" />
          <span className="hidden md:inline">Ассистент</span>
        </Button>

        {/* Add place */}
        <Button
          size="sm"
          onClick={onAddPlace}
          className="h-8 bg-accent text-accent-foreground hover:bg-accent/90 text-xs"
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          <span className="hidden sm:inline">Добавить место</span>
          <span className="sm:hidden">+</span>
        </Button>

        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onOpenSettings}
          aria-label="Настройки API ключей"
        >
          <Settings className="h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
        </Button>

        {/* Auth / user button */}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Меню пользователя"
              >
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onOpenProfile}>
                <User className="mr-2 h-4 w-4" />
                Личный кабинет
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" onClick={onOpenAuth} className="h-8 text-xs">
            <LogIn className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Войти</span>
          </Button>
        )}
      </div>
    </header>
  )
}
