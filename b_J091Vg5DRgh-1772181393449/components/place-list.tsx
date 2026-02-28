'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import PlaceCard from '@/components/place-card'
import type { PlaceWithTags } from '@/lib/types'

interface PlaceListProps {
  places: PlaceWithTags[]
  selectedPlaceId: number | null
  onSelectPlace: (place: PlaceWithTags) => void
}

export default function PlaceList({ places, selectedPlaceId, onSelectPlace }: PlaceListProps) {
  if (places.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <p className="text-sm font-medium text-card-foreground">Ничего не найдено</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Попробуйте изменить фильтры
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-3">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            isSelected={selectedPlaceId === place.id}
            onClick={() => onSelectPlace(place)}
          />
        ))}
      </div>
    </ScrollArea>
  )
}
