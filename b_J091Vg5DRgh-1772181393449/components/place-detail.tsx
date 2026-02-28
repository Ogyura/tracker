'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Star, MapPin, Clock, Phone, X, Navigation, ChevronRight, Camera, ImagePlus, Eye } from 'lucide-react'
import type { PlaceWithTags, Review, UserPhoto } from '@/lib/types'
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'
import ReviewForm from '@/components/review-form'
import { useEffect, useRef, useState } from 'react'

interface PlaceDetailProps {
  place: PlaceWithTags
  onClose: () => void
  onRouteToPlace: (place: PlaceWithTags) => void
}

export default function PlaceDetail({ place, onClose, onRouteToPlace }: PlaceDetailProps) {
  const { user, photos: userPhotos, addPhoto } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showPanorama, setShowPanorama] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const panoramaRef = useRef<HTMLDivElement>(null)
  const panoramaPlayerRef = useRef<any>(null)
  const [panoramaError, setPanoramaError] = useState(false)

  // Get photos for this place from all users (localStorage)
  const placePhotos = userPhotos.filter((p) => p.placeId === place.id)

  // Also get all photos by place name match
  const allPlacePhotos = (() => {
    if (typeof window === 'undefined') return placePhotos
    try {
      const allPhotos: UserPhoto[] = JSON.parse(localStorage.getItem('dostup_rostov_photos') || '[]')
      return allPhotos.filter(
        (p) => p.placeId === place.id || (p.placeName && p.placeName.toLowerCase() === place.name.toLowerCase())
      )
    } catch {
      return placePhotos
    }
  })()

  useEffect(() => {
    fetch(`/api/places/${place.id}/reviews`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(console.error)
  }, [place.id])

  const handleReviewAdded = (review: Review) => {
    setReviews((prev) => [review, ...prev])
    setShowReviewForm(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер — 5 МБ.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      addPhoto({
        imageData: reader.result as string,
        placeId: place.id,
        placeName: place.name,
        caption: '',
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const color = CATEGORY_COLORS[place.category] || '#6b7280'

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-border p-4">
        <div className="flex-1 pr-2">
          <div className="mb-1 flex items-center gap-2">
            <Badge
              className="text-xs font-medium"
              style={{ backgroundColor: color, color: 'white' }}
            >
              {CATEGORY_LABELS[place.category]}
            </Badge>
            <div className="flex items-center gap-0.5">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-card-foreground">
                {Number(place.overall_rating).toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">({place.review_count})</span>
            </div>
          </div>
          <h2 className="text-lg font-bold leading-tight text-card-foreground text-balance">{place.name}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8 shrink-0"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Info */}
          {place.description && (
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{place.description}</p>
          )}

          <div className="mb-4 flex flex-col gap-2">
            {place.address && (
              <div className="flex items-start gap-2 text-sm text-card-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{place.address}</span>
              </div>
            )}
            {place.working_hours && (
              <div className="flex items-start gap-2 text-sm text-card-foreground">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{place.working_hours}</span>
              </div>
            )}
            {place.phone && (
              <div className="flex items-start gap-2 text-sm text-card-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${place.phone}`} className="underline underline-offset-2 hover:text-primary">
                  {place.phone}
                </a>
              </div>
            )}
          </div>

          {/* Route button */}
          <Button
            className="mb-4 w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => onRouteToPlace(place)}
          >
            <Navigation className="mr-2 h-4 w-4" />
            Построить маршрут
          </Button>

          <Separator className="mb-4" />

          {/* Place photos */}
          <div className="mb-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
                <Camera className="h-4 w-4" />
                Фото ({allPlacePhotos.length})
              </h3>
              {user && (
                <>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <ImagePlus className="mr-1 h-3 w-3" />
                    Добавить фото
                  </Button>
                </>
              )}
            </div>
            {allPlacePhotos.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allPlacePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className="h-20 w-28 shrink-0 rounded-lg overflow-hidden bg-muted"
                  >
                    <img
                      src={photo.imageData}
                      alt={photo.caption || `Фото ${place.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                {user ? 'Добавьте первое фото этого места!' : 'Войдите, чтобы добавить фото'}
              </p>
            )}
          </div>

          {/* Accessibility tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-card-foreground">Доступность</h3>
              <div className="flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-accent/15 text-xs text-accent"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="mb-4" />

          {/* Reviews */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                Отзывы ({reviews.length})
              </h3>
              {!showReviewForm && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowReviewForm(true)}
                >
                  Написать отзыв
                  <ChevronRight className="ml-1 h-3 w-3" />
                </Button>
              )}
            </div>

            {showReviewForm && (
              <div className="mb-4">
                <ReviewForm
                  placeId={place.id}
                  placeName={place.name}
                  onSuccess={handleReviewAdded}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {reviews.length === 0 && !showReviewForm && (
              <p className="text-sm text-muted-foreground">Пока нет отзывов. Будьте первым!</p>
            )}

            <div className="flex flex-col gap-3">
              {reviews.map((review) => (
                <Card key={review.id} className="p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">
                      {review.user_name || 'Пользователь'}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-border'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.accessibility_rating && (
                    <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <span>Доступность:</span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-2.5 w-2.5 ${
                              i < review.accessibility_rating!
                                ? 'fill-accent text-accent'
                                : 'text-border'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {review.comment && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{review.comment}</p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground/70">
                    {new Date(review.created_at).toLocaleDateString('ru-RU')}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
