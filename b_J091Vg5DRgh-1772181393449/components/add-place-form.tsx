'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Loader2, MapPinPlus } from 'lucide-react'
import { toast } from 'sonner'
import type { AccessibilityTag, PlaceCategory } from '@/lib/types'
import { CATEGORY_LABELS, DISABILITY_CATEGORY_LABELS, type DisabilityCategory } from '@/lib/types'

interface AddPlaceFormProps {
  tags: AccessibilityTag[]
  onClose: () => void
  onSuccess: () => void
}

const CATEGORIES: PlaceCategory[] = [
  'cafe', 'restaurant', 'hospital', 'clinic', 'pharmacy', 'shop',
  'bank', 'park', 'crossing', 'transport_stop', 'government',
  'education', 'culture', 'sport', 'other',
]

export default function AddPlaceForm({ tags, onClose, onSuccess }: AddPlaceFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<PlaceCategory>('other')
  const [address, setAddress] = useState('')
  const [latitude, setLatitude] = useState('47.2313')
  const [longitude, setLongitude] = useState('39.7233')
  const [phone, setPhone] = useState('')
  const [workingHours, setWorkingHours] = useState('')
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

  const grouped = tags.reduce<Record<string, AccessibilityTag[]>>((acc, tag) => {
    const key = tag.disability_category
    if (!acc[key]) acc[key] = []
    acc[key].push(tag)
    return acc
  }, {})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Введите название места')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          category,
          address: address.trim() || null,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          phone: phone.trim() || null,
          working_hours: workingHours.trim() || null,
          tag_ids: selectedTagIds,
        }),
      })

      if (!res.ok) throw new Error('Ошибка создания')
      toast.success('Место успешно добавлено!')
      onSuccess()
    } catch {
      toast.error('Не удалось добавить место')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <MapPinPlus className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-card-foreground">Добавить место</h2>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Закрыть">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <div>
            <Label htmlFor="place-name" className="text-xs">Название *</Label>
            <Input id="place-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Например: Кафе «Уют»" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="place-category" className="text-xs">Категория *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as PlaceCategory)}>
              <SelectTrigger className="mt-1" id="place-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{CATEGORY_LABELS[cat]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="place-desc" className="text-xs">Описание</Label>
            <Textarea id="place-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Краткое описание места..." rows={2} className="mt-1 text-sm" />
          </div>

          <div>
            <Label htmlFor="place-address" className="text-xs">Адрес</Label>
            <Input id="place-address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="ул. Большая Садовая, 1" className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="place-lat" className="text-xs">Широта</Label>
              <Input id="place-lat" type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="place-lng" className="text-xs">Долгота</Label>
              <Input id="place-lng" type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="place-phone" className="text-xs">Телефон</Label>
              <Input id="place-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (863) ..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="place-hours" className="text-xs">Часы работы</Label>
              <Input id="place-hours" value={workingHours} onChange={(e) => setWorkingHours(e.target.value)} placeholder="09:00–18:00" className="mt-1" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs">Теги доступности</Label>
            <div className="mt-2 flex flex-col gap-3">
              {(Object.keys(grouped) as DisabilityCategory[]).map((cat) => (
                <div key={cat}>
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {DISABILITY_CATEGORY_LABELS[cat]}
                  </p>
                  <div className="flex flex-col gap-1.5 pl-2">
                    {grouped[cat].map((tag) => (
                      <div key={tag.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`add-tag-${tag.id}`}
                          checked={selectedTagIds.includes(tag.id)}
                          onCheckedChange={() => handleToggleTag(tag.id)}
                        />
                        <Label htmlFor={`add-tag-${tag.id}`} className="cursor-pointer text-sm">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Добавить место
          </Button>
        </form>
      </ScrollArea>
    </div>
  )
}
