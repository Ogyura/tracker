import { NextRequest, NextResponse } from 'next/server'
import { mockPlaces } from '@/lib/mock-data'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const tags = searchParams.get('tags')
  const search = searchParams.get('search')

  let result = [...mockPlaces]

  if (category) {
    result = result.filter((p) => p.category === category)
  }

  if (search) {
    const q = search.toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q))
    )
  }

  if (tags) {
    const tagSlugs = tags.split(',').filter(Boolean)
    result = result.filter((place) =>
      tagSlugs.every((slug) => place.tags?.some((t) => t.slug === slug))
    )
  }

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category, address, latitude, longitude, phone, working_hours } = body

    if (!name || !latitude || !longitude || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newPlace = {
      id: Date.now(),
      name,
      description: description || null,
      category,
      address: address || null,
      latitude,
      longitude,
      phone: phone || null,
      website: null,
      working_hours: working_hours || null,
      photo_url: null,
      overall_rating: 0,
      review_count: 0,
      added_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      tags: [],
    }

    mockPlaces.push(newPlace)
    return NextResponse.json(newPlace, { status: 201 })
  } catch (error) {
    console.error('Error creating place:', error)
    return NextResponse.json({ error: 'Failed to create place' }, { status: 500 })
  }
}
