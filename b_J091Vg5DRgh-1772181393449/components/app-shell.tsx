'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import useSWR from 'swr'
import AppHeader from '@/components/app-header'
import FilterPanel from '@/components/filter-panel'
import PlaceList from '@/components/place-list'
import PlaceDetail from '@/components/place-detail'
import AddPlaceForm from '@/components/add-place-form'
import { UserProfile } from '@/components/user-profile'
import { AuthModal } from '@/components/auth-modal'
import AIAgentPanel from '@/components/ai-agent-panel'
import SettingsModal from '@/components/settings-modal'
import DashboardView from '@/components/dashboard-view'
import { Skeleton } from '@/components/ui/skeleton'
import type { PlaceWithTags, AccessibilityTag, PlaceCategory } from '@/lib/types'

const MapView = dynamic(() => import('@/components/map-view'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-secondary">
      <div className="flex flex-col items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
  ),
})

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Panel = 'filters' | 'detail' | 'add' | 'profile' | null

const API_KEYS_STORAGE_KEY = 'dostup-rostov-api-keys'

function loadApiKeys(): { jsApiKey: string; geocoderKey: string } {
  if (typeof window === 'undefined') return { jsApiKey: '', geocoderKey: '' }
  try {
    const raw = localStorage.getItem(API_KEYS_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore
  }
  return { jsApiKey: '', geocoderKey: '' }
}

export default function AppShell() {
  const { data: places = [], mutate: mutatePlaces } = useSWR<PlaceWithTags[]>('/api/places', fetcher)
  const { data: tags = [] } = useSWR<AccessibilityTag[]>('/api/tags', fetcher)

  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlace, setSelectedPlace] = useState<PlaceWithTags | null>(null)
  const [activePanel, setActivePanel] = useState<Panel>('filters')
  const [view, setView] = useState<'map' | 'list' | 'dashboard'>('map')
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [routeTarget, setRouteTarget] = useState<PlaceWithTags | null>(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [agentOpen, setAgentOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [apiKeys, setApiKeys] = useState<{ jsApiKey: string; geocoderKey: string }>({ jsApiKey: '', geocoderKey: '' })

  // Load API keys from localStorage on mount
  useEffect(() => {
    setApiKeys(loadApiKeys())
  }, [])

  const handleSaveApiKeys = useCallback((keys: { jsApiKey: string; geocoderKey: string }) => {
    setApiKeys(keys)
    try {
      localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys))
    } catch {
      // ignore
    }
  }, [])

  // Filter places
  const filteredPlaces = useMemo(() => {
    let result = places

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.address && p.address.toLowerCase().includes(q))
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.every((slug) => p.tags?.some((t) => t.slug === slug))
      )
    }

    return result
  }, [places, selectedCategory, searchQuery, selectedTags])

  const handleToggleTag = useCallback((slug: string) => {
    setSelectedTags((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    )
  }, [])

  const handleSelectPlace = useCallback((place: PlaceWithTags) => {
    setSelectedPlace(place)
    setActivePanel('detail')
    setMobileSidebarOpen(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setSelectedPlace(null)
    setActivePanel('filters')
  }, [])

  const handleAddPlace = useCallback(() => {
    setActivePanel('add')
    setMobileSidebarOpen(true)
  }, [])

  const handleAddPlaceSuccess = useCallback(() => {
    mutatePlaces()
    setActivePanel('filters')
  }, [mutatePlaces])

  const handleRouteToPlace = useCallback((place: PlaceWithTags) => {
    setRouteTarget(place)
  }, [])

  const handleClearFilters = useCallback(() => {
    setSelectedTags([])
    setSelectedCategory(null)
    setSearchQuery('')
  }, [])

  const handleOpenProfile = useCallback(() => {
    setActivePanel('profile')
    setMobileSidebarOpen(true)
  }, [])

  // Close mobile sidebar on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false)
        if (activePanel === 'detail') handleCloseDetail()
        if (activePanel === 'add') setActivePanel('filters')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activePanel, handleCloseDetail])

  return (
    <div className="flex h-dvh flex-col bg-background">
      <AppHeader
        placeCount={filteredPlaces.length}
        view={view}
        onSetView={setView}
        onAddPlace={handleAddPlace}
        onToggleSidebar={() => setMobileSidebarOpen((v) => !v)}
        sidebarOpen={mobileSidebarOpen}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={handleOpenProfile}
        onOpenAgent={() => setAgentOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar / Panel */}
        <aside
          className={`
            absolute inset-y-0 left-0 z-20 w-[320px] border-r border-border bg-card transition-transform duration-300
            md:relative md:translate-x-0
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Боковая панель"
        >
          {activePanel === 'filters' && (
            <FilterPanel
              tags={tags}
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onClearFilters={handleClearFilters}
              places={places}
              onSelectPlace={handleSelectPlace}
            />
          )}
          {activePanel === 'detail' && selectedPlace && (
            <PlaceDetail
              place={selectedPlace}
              onClose={handleCloseDetail}
              onRouteToPlace={handleRouteToPlace}
            />
          )}
          {activePanel === 'add' && (
            <AddPlaceForm
              tags={tags}
              onClose={() => setActivePanel('filters')}
              onSuccess={handleAddPlaceSuccess}
            />
          )}
          {activePanel === 'profile' && (
            <UserProfile
              onClose={() => {
                setActivePanel('filters')
              }}
            />
          )}
        </aside>

        {/* Overlay for mobile */}
        {mobileSidebarOpen && (
          <div
            className="absolute inset-0 z-10 bg-foreground/20 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Main content */}
        <main className="flex-1" aria-label="Основное содержимое">
          {view === 'map' ? (
            <MapView
              places={filteredPlaces}
              selectedPlaceId={selectedPlace?.id ?? null}
              onSelectPlace={handleSelectPlace}
              routeTarget={routeTarget}
              onClearRoute={() => setRouteTarget(null)}
              jsApiKey={apiKeys.jsApiKey}
              geocoderKey={apiKeys.geocoderKey}
            />
          ) : view === 'list' ? (
            <PlaceList
              places={filteredPlaces}
              selectedPlaceId={selectedPlace?.id ?? null}
              onSelectPlace={handleSelectPlace}
            />
          ) : (
            <DashboardView
              places={filteredPlaces}
              onSelectPlace={handleSelectPlace}
            />
          )}
        </main>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <AIAgentPanel open={agentOpen} onOpen={() => setAgentOpen(true)} onClose={() => setAgentOpen(false)} />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveApiKeys}
        currentKeys={apiKeys}
      />
    </div>
  )
}
