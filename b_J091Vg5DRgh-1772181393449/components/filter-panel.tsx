'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Accessibility, Eye, Ear, Brain, Search, X, SlidersHorizontal, MapPin,
} from 'lucide-react'
import type { AccessibilityTag, PlaceCategory, PlaceWithTags } from '@/lib/types'
import { CATEGORY_LABELS, DISABILITY_CATEGORY_LABELS } from '@/lib/types'

interface FilterPanelProps {
  tags: AccessibilityTag[]
  selectedTags: string[]
  onToggleTag: (slug: string) => void
  selectedCategory: PlaceCategory | null
  onSelectCategory: (cat: PlaceCategory | null) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onClearFilters: () => void
  places?: PlaceWithTags[]
  onSelectPlace?: (place: PlaceWithTags) => void
}

const DISABILITY_ICONS = {
  mobility: Accessibility,
  vision: Eye,
  hearing: Ear,
  cognitive: Brain,
}

const CATEGORIES_TO_SHOW: PlaceCategory[] = [
  'restaurant', 'cafe', 'theater', 'cinema', 'hospital', 'clinic', 'pharmacy', 'shop', 'education', 'culture', 'sport', 'transport_stop', 'government', 'park', 'crossing', 'toilet',
]

export default function FilterPanel({
  tags,
  selectedTags,
  onToggleTag,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onClearFilters,
  places = [],
  onSelectPlace,
}: FilterPanelProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const grouped = tags.reduce<Record<string, AccessibilityTag[]>>((acc, tag) => {
    const key = tag.disability_category
    if (!acc[key]) acc[key] = []
    acc[key].push(tag)
    return acc
  }, {})

  const hasFilters = selectedTags.length > 0 || selectedCategory !== null || searchQuery.length > 0

  // Alphabetical autocomplete suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || !places.length) return []
    const q = searchQuery.toLowerCase().trim()
    return places
      .filter((p) => p.name.toLowerCase().startsWith(q) || (p.address && p.address.toLowerCase().startsWith(q)))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'))
      .slice(0, 50)
  }, [searchQuery, places])

  // Group suggestions by first letter
  const groupedSuggestions = useMemo(() => {
    const groups: Record<string, PlaceWithTags[]> = {}
    for (const place of suggestions) {
      const letter = place.name[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(place)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, 'ru'))
  }, [suggestions])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const showDropdown = isSearchFocused && searchQuery.trim().length > 0 && groupedSuggestions.length > 0

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-card-foreground">Фильтры</h2>
        </div>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs text-muted-foreground hover:text-destructive"
          >
            <X className="mr-1 h-3 w-3" />
            Сбросить
          </Button>
        )}
      </div>

      {/* Search with autocomplete */}
      <div className="px-4 py-3" ref={searchContainerRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Поиск по названию или адресу..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            className="pl-9 text-sm"
            aria-label="Поиск мест"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              onClick={() => { onSearchChange(''); inputRef.current?.focus() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Очистить поиск"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Autocomplete dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[320px] overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
              <div className="px-3 py-2 border-b border-border">
                <span className="text-[11px] text-muted-foreground">
                  {'Найдено: '}{suggestions.length}{' '}
                  {suggestions.length === 1 ? 'место' : suggestions.length < 5 ? 'места' : 'мест'}
                </span>
              </div>
              {groupedSuggestions.map(([letter, items]) => (
                <div key={letter}>
                  <div className="sticky top-0 z-10 bg-secondary/80 backdrop-blur-sm px-3 py-1">
                    <span className="text-xs font-bold text-primary">{letter}</span>
                  </div>
                  {items.map((place) => (
                    <button
                      key={place.id}
                      className="flex w-full items-start gap-2 px-3 py-2 text-left transition-colors hover:bg-secondary/60"
                      onClick={() => {
                        onSearchChange(place.name)
                        setIsSearchFocused(false)
                        onSelectPlace?.(place)
                      }}
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary/70" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-card-foreground">
                          {place.name}
                        </p>
                        {place.address && (
                          <p className="truncate text-[11px] text-muted-foreground">
                            {place.address}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        {/* Category filter */}
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-card-foreground">Категория</h3>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES_TO_SHOW.map((cat) => (
              <Badge
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                className={`cursor-pointer text-xs transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-secondary'
                }`}
                onClick={() => onSelectCategory(selectedCategory === cat ? null : cat)}
                role="checkbox"
                aria-checked={selectedCategory === cat}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onSelectCategory(selectedCategory === cat ? null : cat)
                  }
                }}
              >
                {CATEGORY_LABELS[cat]}
              </Badge>
            ))}
          </div>
        </div>

        <Separator className="mb-4" />

        {/* Accessibility tags grouped by disability category */}
        <div>
          <h3 className="mb-3 text-sm font-medium text-card-foreground">Доступность</h3>
          {(Object.keys(grouped) as Array<keyof typeof DISABILITY_ICONS>).map((category) => {
            const Icon = DISABILITY_ICONS[category]
            return (
              <div key={category} className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4 text-primary" />}
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {DISABILITY_CATEGORY_LABELS[category]}
                  </span>
                </div>
                <div className="flex flex-col gap-2 pl-6">
                  {grouped[category].map((tag) => (
                    <div key={tag.slug} className="flex items-center gap-2">
                      <Checkbox
                        id={`tag-${tag.slug}`}
                        checked={selectedTags.includes(tag.slug)}
                        onCheckedChange={() => onToggleTag(tag.slug)}
                        aria-label={tag.name}
                      />
                      <Label
                        htmlFor={`tag-${tag.slug}`}
                        className="cursor-pointer text-sm leading-tight text-card-foreground"
                      >
                        {tag.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
