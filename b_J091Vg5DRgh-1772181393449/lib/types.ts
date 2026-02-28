// Types for the accessible navigation platform

export type PlaceCategory =
  | 'cafe' | 'restaurant' | 'hospital' | 'clinic' | 'pharmacy'
  | 'shop' | 'bank' | 'park' | 'crossing' | 'transport_stop'
  | 'government' | 'education' | 'culture' | 'sport' | 'toilet'
  | 'theater' | 'cinema' | 'other'

export type DisabilityCategory = 'mobility' | 'vision' | 'hearing' | 'cognitive'

export interface Place {
  id: number
  name: string
  description: string | null
  category: PlaceCategory
  address: string | null
  latitude: number
  longitude: number
  phone: string | null
  website: string | null
  working_hours: string | null
  photo_url: string | null
  overall_rating: number
  review_count: number
  added_by: number | null
  created_at: string
  updated_at: string
  tags?: AccessibilityTag[]
}

export interface AccessibilityTag {
  id: number
  name: string
  slug: string
  icon: string | null
  disability_category: DisabilityCategory
  description: string | null
}

export interface Review {
  id: number
  place_id: number
  user_id: number
  rating: number
  comment: string | null
  accessibility_rating: number | null
  created_at: string
  user_name?: string
}

export interface PlaceWithTags extends Place {
  tags: AccessibilityTag[]
}

export const CATEGORY_LABELS: Record<PlaceCategory, string> = {
  cafe: 'Кафе',
  restaurant: 'Ресторан',
  hospital: 'Больница',
  clinic: 'Поликлиника',
  pharmacy: 'Аптека',
  shop: 'Магазин',
  bank: 'Банк',
  park: 'Парк',
  crossing: 'Переход',
  transport_stop: 'Транспорт',
  government: 'Госучреждение',
  education: 'Образование',
  culture: 'Культура',
  sport: 'Спорт',
  toilet: 'Туалет',
  theater: 'Театр',
  cinema: 'Кинотеатр',
  other: 'Другое',
}

export const CATEGORY_ICONS: Record<PlaceCategory, string> = {
  cafe: 'Coffee',
  restaurant: 'UtensilsCrossed',
  hospital: 'Hospital',
  clinic: 'Stethoscope',
  pharmacy: 'Pill',
  shop: 'ShoppingBag',
  bank: 'Landmark',
  park: 'Trees',
  crossing: 'Footprints',
  transport_stop: 'Bus',
  government: 'Building2',
  education: 'GraduationCap',
  culture: 'Palette',
  sport: 'Dumbbell',
  toilet: 'Bath',
  theater: 'Drama',
  cinema: 'Film',
  other: 'MapPin',
}

export const DISABILITY_CATEGORY_LABELS: Record<DisabilityCategory, string> = {
  mobility: 'Мобильность',
  vision: 'Зрение',
  hearing: 'Слух',
  cognitive: 'Когнитивные',
}

// Auth types (localStorage-based)
export interface AuthUser {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: string
}

export interface UserPhoto {
  id: string
  userId: string
  placeId?: number
  placeName?: string
  imageData: string // base64
  caption: string
  createdAt: string
}

export interface UserReview {
  id: string
  userId: string
  placeId: number
  placeName: string
  rating: number
  comment: string
  createdAt: string
}

export const CATEGORY_COLORS: Record<PlaceCategory, string> = {
  cafe: '#d97706',
  restaurant: '#d97706',
  hospital: '#dc2626',
  clinic: '#dc2626',
  pharmacy: '#16a34a',
  shop: '#7c3aed',
  bank: '#0369a1',
  park: '#16a34a',
  crossing: '#ea580c',
  transport_stop: '#2563eb',
  government: '#4338ca',
  education: '#0891b2',
  culture: '#c026d3',
  sport: '#059669',
  toilet: '#0d9488',
  theater: '#9333ea',
  cinema: '#e11d48',
  other: '#6b7280',
}
