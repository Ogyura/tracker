'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Settings, Key, Map, Search, Check, ExternalLink } from 'lucide-react'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  onSave: (keys: { jsApiKey: string; geocoderKey: string }) => void
  currentKeys: { jsApiKey: string; geocoderKey: string }
}

export default function SettingsModal({ open, onClose, onSave, currentKeys }: SettingsModalProps) {
  const [jsApiKey, setJsApiKey] = useState(currentKeys.jsApiKey)
  const [geocoderKey, setGeocoderKey] = useState(currentKeys.geocoderKey)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setJsApiKey(currentKeys.jsApiKey)
    setGeocoderKey(currentKeys.geocoderKey)
    setSaved(false)
  }, [currentKeys, open])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  function handleSave() {
    onSave({ jsApiKey, geocoderKey })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Settings className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-tight">Настройки API</h2>
              <p className="text-[11px] text-muted-foreground leading-tight">Яндекс Карты JavaScript API и Геокодер</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Info */}
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-3">
            <p className="text-[12px] text-foreground leading-relaxed">
              Для работы карты и поиска адресов введите свои API-ключи Яндекс.Карт. Их можно получить в{' '}
              <a
                href="https://developer.tech.yandex.ru/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium underline underline-offset-2 inline-flex items-center gap-0.5"
              >
                Кабинете разработчика
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
              . Если ключи не указаны, используются встроенные демо-ключи.
            </p>
          </div>

          {/* JS API Key */}
          <div className="space-y-2">
            <Label htmlFor="js-api-key" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5 text-primary" />
              JavaScript API ключ
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="js-api-key"
                value={jsApiKey}
                onChange={(e) => setJsApiKey(e.target.value)}
                placeholder="Введите ключ JavaScript API..."
                className="pl-9 h-10 text-sm rounded-xl"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Используется для отображения карты. API: JavaScript API и HTTP Геокодер.
            </p>
          </div>

          {/* Geocoder Key */}
          <div className="space-y-2">
            <Label htmlFor="geocoder-key" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-chart-2" />
              Ключ Геокодера
            </Label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="geocoder-key"
                value={geocoderKey}
                onChange={(e) => setGeocoderKey(e.target.value)}
                placeholder="Введите ключ Геокодера..."
                className="pl-9 h-10 text-sm rounded-xl"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Используется для поиска адресов и геокодирования на карте.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border bg-secondary/20">
          <Button variant="outline" size="sm" onClick={onClose} className="h-9 px-4 text-xs rounded-xl">
            Отмена
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="h-9 px-5 text-xs rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {saved ? (
              <span className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                Сохранено
              </span>
            ) : (
              'Сохранить ключи'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
