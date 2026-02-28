'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin } from 'lucide-react'
import type { PlaceWithTags } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types'

interface PlaceCardProps {
  place: PlaceWithTags
  isSelected: boolean
  onClick: () => void
}

export default function PlaceCard({ place, isSelected, onClick }: PlaceCardProps) {
  const color = CATEGORY_COLORS[place.category] || '#6b7280'

  return (
    <Card
      className={`cursor-pointer p-3 transition-all hover:shadow-md ${
        isSelected
          ? 'ring-2 ring-primary shadow-md'
          : 'hover:ring-1 hover:ring-border'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${place.name}, ${CATEGORY_LABELS[place.category]}, рейтинг ${place.overall_rating}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <div className="mb-1.5 flex items-start justify-between">
        <Badge
          className="text-[11px] font-medium"
          style={{ backgroundColor: color, color: 'white' }}
        >
          {CATEGORY_LABELS[place.category]}
        </Badge>
        <div className="flex items-center gap-0.5">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold text-card-foreground">
            {Number(place.overall_rating).toFixed(1)}
          </span>
        </div>
      </div>

      <h3 className="mb-1 text-sm font-semibold leading-snug text-card-foreground text-pretty">{place.name}</h3>

      {place.address && (
        <div className="mb-2 flex items-start gap-1 text-xs text-muted-foreground">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
          <span className="line-clamp-1">{place.address}</span>
        </div>
      )}

      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {place.tags.slice(0, 4).map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag.name}
            </Badge>
          ))}
          {place.tags.length > 4 && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              +{place.tags.length - 4}
            </Badge>
          )}
        </div>
      )}
    </Card>
  )
}
