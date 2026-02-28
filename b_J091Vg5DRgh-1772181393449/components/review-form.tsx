'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star, Loader2, LogIn } from 'lucide-react'
import type { Review } from '@/lib/types'
import { useAuth } from '@/lib/auth-context'

interface ReviewFormProps {
  placeId: number
  placeName?: string
  onSuccess: (review: Review) => void
  onCancel: () => void
  onOpenAuth?: () => void
}

function StarRating({
  value,
  onChange,
  label,
}: {
  value: number
  onChange: (v: number) => void
  label: string
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div>
      <Label className="mb-1 text-xs text-muted-foreground">{label}</Label>
      <div className="flex gap-0.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} из 5`}
          >
            <Star
              className={`h-5 w-5 transition-colors ${
                star <= (hovered || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-border'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ReviewForm({ placeId, placeName, onSuccess, onCancel, onOpenAuth }: ReviewFormProps) {
  const { user, addReview } = useAuth()
  const [rating, setRating] = useState(0)
  const [accessibilityRating, setAccessibilityRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!user) {
    return (
      <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
        <p className="mb-3 text-sm text-muted-foreground">
          Войдите в аккаунт, чтобы оставить отзыв
        </p>
        {onOpenAuth && (
          <Button size="sm" variant="outline" onClick={onOpenAuth}>
            <LogIn className="mr-1.5 h-3.5 w-3.5" />
            Войти
          </Button>
        )}
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError('Укажите общую оценку')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/places/${placeId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          accessibility_rating: accessibilityRating || null,
          comment: comment.trim() || null,
        }),
      })

      if (!res.ok) throw new Error('Ошибка отправки')
      const review = await res.json()
      // Save review to user profile as well
      if (placeName) {
        addReview({
          placeId,
          placeName,
          rating,
          comment: comment.trim(),
        })
      }
      onSuccess({ ...review, user_name: user.name })
    } catch {
      setError('Не удалось отправить отзыв')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-secondary/30 p-3">
      <div className="mb-3 flex flex-col gap-3">
        <StarRating value={rating} onChange={setRating} label="Общая оценка *" />
        <StarRating
          value={accessibilityRating}
          onChange={setAccessibilityRating}
          label="Оценка доступности"
        />
      </div>

      <div className="mb-3">
        <Label htmlFor="comment" className="mb-1 text-xs text-muted-foreground">
          Комментарий
        </Label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Расскажите о своём опыте..."
          rows={3}
          className="text-sm"
        />
      </div>

      {error && <p className="mb-2 text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {loading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
          Отправить
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  )
}
