'use client'

import { useMemo, useState } from 'react'
import type { PlaceWithTags, DisabilityCategory, PlaceCategory } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_COLORS, DISABILITY_CATEGORY_LABELS } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import {
  Star,
  MessageSquare,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Accessibility,
  Eye,
  EarOff,
  Brain,
  AlertTriangle,
  Trophy,
  TrendingUp,
  MapPin,
  Shield,
  ChevronRight,
} from 'lucide-react'

interface DashboardViewProps {
  places: PlaceWithTags[]
  onSelectPlace: (place: PlaceWithTags) => void
}

type SortKey = 'rating' | 'reviews' | 'tags'
type SortDir = 'asc' | 'desc'

const DISABILITY_ICONS: Record<DisabilityCategory, React.ElementType> = {
  mobility: Accessibility,
  vision: Eye,
  hearing: EarOff,
  cognitive: Brain,
}

const DISABILITY_COLORS: Record<DisabilityCategory, string> = {
  mobility: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  vision: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  hearing: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  cognitive: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${
            s <= Math.round(rating)
              ? 'fill-chart-3 text-chart-3'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

function PlaceRow({
  place,
  rank,
  onClick,
}: {
  place: PlaceWithTags
  rank: number
  onClick: () => void
}) {
  const mobilityTags = place.tags?.filter((t) => t.disability_category === 'mobility').length || 0
  const visionTags = place.tags?.filter((t) => t.disability_category === 'vision').length || 0
  const hearingTags = place.tags?.filter((t) => t.disability_category === 'hearing').length || 0
  const cognitiveTags = place.tags?.filter((t) => t.disability_category === 'cognitive').length || 0
  const totalTags = place.tags?.length || 0

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary/80 transition-colors text-left group"
    >
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shrink-0 ${
          rank <= 3
            ? 'bg-chart-3/15 text-chart-3'
            : 'bg-secondary text-muted-foreground'
        }`}
      >
        {rank}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">{place.name}</span>
          <Badge
            variant="secondary"
            className="text-[9px] px-1 py-0 shrink-0"
            style={{ borderColor: CATEGORY_COLORS[place.category] + '40', color: CATEGORY_COLORS[place.category] }}
          >
            {CATEGORY_LABELS[place.category]}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <RatingStars rating={place.overall_rating} />
          <span className="text-[10px] text-muted-foreground">
            {place.review_count} отз.
          </span>
          <div className="flex items-center gap-1 ml-auto">
            {mobilityTags > 0 && (
              <div className="flex h-4 w-4 items-center justify-center rounded bg-chart-1/10" title={`${mobilityTags} тегов мобильности`}>
                <Accessibility className="h-2.5 w-2.5 text-chart-1" />
              </div>
            )}
            {visionTags > 0 && (
              <div className="flex h-4 w-4 items-center justify-center rounded bg-chart-2/10" title={`${visionTags} тегов зрения`}>
                <Eye className="h-2.5 w-2.5 text-chart-2" />
              </div>
            )}
            {hearingTags > 0 && (
              <div className="flex h-4 w-4 items-center justify-center rounded bg-chart-3/10" title={`${hearingTags} тегов слуха`}>
                <EarOff className="h-2.5 w-2.5 text-chart-3" />
              </div>
            )}
            {cognitiveTags > 0 && (
              <div className="flex h-4 w-4 items-center justify-center rounded bg-chart-4/10" title={`${cognitiveTags} когнитивных тегов`}>
                <Brain className="h-2.5 w-2.5 text-chart-4" />
              </div>
            )}
            <span className="text-[9px] text-muted-foreground ml-0.5">{totalTags}</span>
          </div>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </button>
  )
}

export default function DashboardView({ places, onSelectPlace }: DashboardViewProps) {
  const [sortKey, setSortKey] = useState<SortKey>('rating')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [activeTab, setActiveTab] = useState<'ranking' | 'categories' | 'danger'>('ranking')

  // Top places per disability category
  const topByDisability = useMemo(() => {
    const categories: DisabilityCategory[] = ['mobility', 'vision', 'hearing', 'cognitive']
    const result: Record<DisabilityCategory, PlaceWithTags[]> = {
      mobility: [],
      vision: [],
      hearing: [],
      cognitive: [],
    }

    categories.forEach((cat) => {
      result[cat] = [...places]
        .map((p) => ({
          ...p,
          _catTagCount: p.tags?.filter((t) => t.disability_category === cat).length || 0,
        }))
        .filter((p) => p._catTagCount > 0)
        .sort((a, b) => {
          if (b._catTagCount !== a._catTagCount) return b._catTagCount - a._catTagCount
          return b.overall_rating - a.overall_rating
        })
        .slice(0, 5)
    })

    return result
  }, [places])

  // Category stats
  const categoryStats = useMemo(() => {
    const cats = Object.keys(CATEGORY_LABELS) as PlaceCategory[]
    return cats
      .map((cat) => {
        const catPlaces = places.filter((p) => p.category === cat)
        if (catPlaces.length === 0) return null
        const avgRating =
          catPlaces.reduce((sum, p) => sum + p.overall_rating, 0) / catPlaces.length
        const totalReviews = catPlaces.reduce((sum, p) => sum + p.review_count, 0)
        const avgTags =
          catPlaces.reduce((sum, p) => sum + (p.tags?.length || 0), 0) / catPlaces.length
        return {
          category: cat,
          label: CATEGORY_LABELS[cat],
          count: catPlaces.length,
          avgRating,
          totalReviews,
          avgTags,
          color: CATEGORY_COLORS[cat],
        }
      })
      .filter(Boolean)
      .sort((a, b) => b!.avgRating - a!.avgRating) as NonNullable<
      ReturnType<typeof Array.prototype.map>[number]
    >[]
  }, [places])

  // Sorted full ranking
  const sortedPlaces = useMemo(() => {
    const sorted = [...places]
    sorted.sort((a, b) => {
      let diff = 0
      if (sortKey === 'rating') diff = a.overall_rating - b.overall_rating
      else if (sortKey === 'reviews') diff = a.review_count - b.review_count
      else diff = (a.tags?.length || 0) - (b.tags?.length || 0)
      return sortDir === 'desc' ? -diff : diff
    })
    return sorted
  }, [places, sortKey, sortDir])

  // Dangerous/inaccessible areas (places with low tag count and low rating)
  const dangerousAreas = useMemo(() => {
    return [...places]
      .filter((p) => {
        const mobilityTags = p.tags?.filter((t) => t.disability_category === 'mobility').length || 0
        return mobilityTags <= 2 && p.overall_rating < 4.0
      })
      .sort((a, b) => a.overall_rating - b.overall_rating)
      .slice(0, 10)
  }, [places])

  // Overall stats
  const stats = useMemo(() => {
    const total = places.length
    const avgRating = places.reduce((s, p) => s + p.overall_rating, 0) / total
    const totalReviews = places.reduce((s, p) => s + p.review_count, 0)
    const totalTags = places.reduce((s, p) => s + (p.tags?.length || 0), 0)
    const fullyAccessible = places.filter((p) => (p.tags?.length || 0) >= 8).length
    return { total, avgRating, totalReviews, totalTags, fullyAccessible }
  }, [places])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3" />
    return sortDir === 'desc' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4 max-w-5xl mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Всего мест', value: stats.total, icon: MapPin, color: 'text-primary' },
            { label: 'Ср. рейтинг', value: stats.avgRating.toFixed(1), icon: Star, color: 'text-chart-3' },
            { label: 'Отзывов', value: stats.totalReviews, icon: MessageSquare, color: 'text-chart-2' },
            { label: 'Тегов', value: stats.totalTags, icon: Shield, color: 'text-chart-1' },
            { label: 'Полностью доступных', value: stats.fullyAccessible, icon: Trophy, color: 'text-accent' },
          ].map((stat) => (
            <Card key={stat.label} className="py-0">
              <CardContent className="p-3 flex items-center gap-2">
                <stat.icon className={`h-5 w-5 ${stat.color} shrink-0`} />
                <div>
                  <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
          {[
            { id: 'ranking' as const, label: 'Рейтинг мест', icon: TrendingUp },
            { id: 'categories' as const, label: 'По категориям', icon: Shield },
            { id: 'danger' as const, label: 'Опасные зоны', icon: AlertTriangle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* RANKING TAB */}
        {activeTab === 'ranking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Top by disability - cards */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Лучшие по типу инвалидности</h3>
              {(['mobility', 'vision', 'hearing', 'cognitive'] as DisabilityCategory[]).map((cat) => {
                const Icon = DISABILITY_ICONS[cat]
                const topPlaces = topByDisability[cat]
                if (topPlaces.length === 0) return null
                return (
                  <Card key={cat} className="py-0 overflow-hidden">
                    <CardHeader className="px-3 py-2 bg-secondary/30">
                      <CardTitle className="text-xs font-semibold flex items-center gap-1.5">
                        <div className={`flex h-5 w-5 items-center justify-center rounded-md border ${DISABILITY_COLORS[cat]}`}>
                          <Icon className="h-3 w-3" />
                        </div>
                        {DISABILITY_CATEGORY_LABELS[cat]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-1">
                      {topPlaces.map((p, i) => (
                        <button
                          key={p.id}
                          onClick={() => onSelectPlace(p)}
                          className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors text-left"
                        >
                          <span className={`text-[10px] font-bold w-4 text-center ${i === 0 ? 'text-chart-3' : 'text-muted-foreground'}`}>
                            {i + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-medium text-foreground truncate">{p.name}</p>
                            <div className="flex items-center gap-1">
                              <Star className={`h-2.5 w-2.5 ${i === 0 ? 'fill-chart-3 text-chart-3' : 'text-muted-foreground/40'}`} />
                              <span className="text-[10px] text-muted-foreground">{p.overall_rating}</span>
                              <span className="text-[10px] text-muted-foreground">/ {p.tags?.filter((t) => t.disability_category === cat).length} тегов</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Full ranking */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">Общий рейтинг</h3>
                <div className="flex gap-1">
                  {[
                    { key: 'rating' as SortKey, label: 'Рейтинг' },
                    { key: 'reviews' as SortKey, label: 'Отзывы' },
                    { key: 'tags' as SortKey, label: 'Теги' },
                  ].map((btn) => (
                    <Button
                      key={btn.key}
                      variant={sortKey === btn.key ? 'default' : 'outline'}
                      size="sm"
                      className="h-6 text-[10px] px-2 gap-0.5"
                      onClick={() => toggleSort(btn.key)}
                    >
                      {btn.label}
                      <SortIcon col={btn.key} />
                    </Button>
                  ))}
                </div>
              </div>
              <Card className="py-0">
                <CardContent className="p-1">
                  <div className="divide-y divide-border/50">
                    {sortedPlaces.slice(0, 20).map((place, i) => (
                      <PlaceRow
                        key={place.id}
                        place={place}
                        rank={i + 1}
                        onClick={() => onSelectPlace(place)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryStats.map((cat) => (
              <Card key={cat.category} className="py-0">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="h-3 w-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                    <Badge variant="secondary" className="text-[10px] ml-auto">{cat.count} мест</Badge>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Средний рейтинг</span>
                      <span className="font-medium text-foreground">{cat.avgRating.toFixed(1)}</span>
                    </div>
                    <Progress value={cat.avgRating * 20} className="h-1.5" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Всего отзывов</span>
                      <span className="font-medium text-foreground">{cat.totalReviews}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Ср. тегов доступности</span>
                      <span className="font-medium text-foreground">{cat.avgTags.toFixed(1)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* DANGER ZONES TAB */}
        {activeTab === 'danger' && (
          <div className="space-y-3">
            <Card className="py-0 border-destructive/30">
              <CardHeader className="px-4 py-3 bg-destructive/5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Наименее доступные места для колясочников
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Места с малым количеством тегов мобильности и низким рейтингом
                </p>
              </CardHeader>
              <CardContent className="p-1">
                <div className="divide-y divide-border/50">
                  {dangerousAreas.map((place, i) => {
                    const mobilityTags = place.tags?.filter(
                      (t) => t.disability_category === 'mobility'
                    ).length || 0
                    return (
                      <button
                        key={place.id}
                        onClick={() => onSelectPlace(place)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-destructive/5 transition-colors text-left"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive text-xs font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{place.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <RatingStars rating={place.overall_rating} />
                            <Badge variant="outline" className="text-[9px] px-1 py-0 border-destructive/30 text-destructive">
                              {mobilityTags} тег{mobilityTags === 1 ? '' : mobilityTags < 5 ? 'а' : 'ов'} мобильности
                            </Badge>
                          </div>
                          {place.address && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{place.address}</p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tips card */}
            <Card className="py-0 border-chart-3/30">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-chart-2" />
                  Рекомендации по безопасности
                </h4>
                <ul className="space-y-1.5 text-[12px] text-muted-foreground">
                  <li className="flex gap-1.5">
                    <span className="text-chart-1 font-bold shrink-0">1.</span>
                    Избегайте участков без пандусов и пониженных бордюров
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-chart-1 font-bold shrink-0">2.</span>
                    Планируйте маршрут по главным улицам с тактильной плиткой
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-chart-1 font-bold shrink-0">3.</span>
                    Звоните в заведение перед посещением для уточнения доступности
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-chart-1 font-bold shrink-0">4.</span>
                    Используйте AI-агента для получения актуальной информации
                  </li>
                  <li className="flex gap-1.5">
                    <span className="text-chart-1 font-bold shrink-0">5.</span>
                    Оставляйте отзывы, чтобы помочь другим пользователям
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
