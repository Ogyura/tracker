import { NextRequest, NextResponse } from 'next/server'
import { mockReviews } from '@/lib/mock-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const placeId = parseInt(id)
  const reviews = mockReviews.filter((r) => r.place_id === placeId)
  return NextResponse.json(reviews)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const placeId = parseInt(id)

  try {
    const body = await request.json()
    const { rating, accessibility_rating, comment, user_name } = body

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    const newReview = {
      id: Date.now(),
      place_id: placeId,
      user_id: 1,
      rating,
      accessibility_rating: accessibility_rating || null,
      comment: comment || null,
      created_at: new Date().toISOString(),
      user_name: user_name || 'Пользователь',
    }

    mockReviews.push(newReview)
    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 })
  }
}
