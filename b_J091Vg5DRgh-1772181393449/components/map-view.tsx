'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import type { PlaceWithTags } from '@/lib/types'
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search, X, Navigation, Car, Footprints,
  Bus, Clock, Ruler, ChevronDown, ChevronUp, Locate,
  MapPin, Route, ArrowRight,
} from 'lucide-react'

interface MapViewProps {
  places: PlaceWithTags[]
  selectedPlaceId: number | null
  onSelectPlace: (place: PlaceWithTags) => void
  routeTarget: PlaceWithTags | null
  onClearRoute: () => void
  jsApiKey?: string
  geocoderKey?: string
}

const ROSTOV_CENTER: [number, number] = [47.2313, 39.7233]
const ROSTOV_OBLAST_CENTER: [number, number] = [47.5, 40.2]
const DEFAULT_ZOOM = 8

const CATEGORY_SVG_ICONS: Record<string, string> = {
  cafe: 'M3 10h2v6H3zm14 0h2v6h-2zm-7-7a1 1 0 011 1v2h4a1 1 0 010 2H6a1 1 0 010-2h4V4a1 1 0 011-1zm-5 7h12v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z',
  restaurant: 'M11 2a1 1 0 012 0v5a3 3 0 01-2 2.83V22h-2V9.83A3 3 0 017 7V2h2v5a1 1 0 002 0V2zm7 0v8a4 4 0 01-3 3.87V22h-2V13.87A4 4 0 0116 10V2h2z',
  hospital: 'M12 2L3 7v2h18V7L12 2zM5 11v9a2 2 0 002 2h10a2 2 0 002-2v-9H5zm5 2h4v2h2v4h-2v2h-4v-2H8v-4h2v-2z',
  clinic: 'M12 2a2 2 0 012 2v2h2a2 2 0 012 2v2a6 6 0 01-12 0V8a2 2 0 012-2h2V4a2 2 0 012-2zm-3 8a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8a1 1 0 10-2 0v2H9z',
  pharmacy: 'M9 2h6v4h4v6h-4v4h-6v-4H5V6h4V2zm1 2v3H6v4h4v3h4v-3h4V7h-4V4h-4z',
  shop: 'M4 7l1-4h14l1 4H4zm0 2v11a1 1 0 001 1h14a1 1 0 001-1V9H4zm5 2h6v2H9v-2z',
  bank: 'M12 2L2 8h20L12 2zM4 10v8h3v-8H4zm5 0v8h3v-8H9zm5 0v8h3v-8h-3zM2 20h20v2H2v-2z',
  park: 'M12 2C9 2 7 5 7 8c0 2 1 3 2 4l-3 7h12l-3-7c1-1 2-2 2-4 0-3-2-6-5-6zm-3 18h6v2H9v-2z',
  crossing: 'M12 2a3 3 0 110 6 3 3 0 010-6zM9 10h6l2 12H7l2-12z',
  transport_stop: 'M6 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V4zm2 0v8h8V4H8zm1 10a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2zM8 20h2v2H8v-2zm6 0h2v2h-2v-2z',
  government: 'M12 2L2 8h20L12 2zM4 10v10h16V10H4zm3 2h4v6H7v-6zm6 0h4v6h-4v-6z',
  education: 'M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z',
  culture: 'M12 2a6 6 0 00-6 6c0 2.5 1.5 4.5 3 5.74V22h6v-8.26c1.5-1.24 3-3.24 3-5.74a6 6 0 00-6-6z',
  sport: 'M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z',
  toilet: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 2a2 2 0 110 4 2 2 0 010-4z',
  theater: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-1-1 3-3-3-3 1-1 4 4-4 4zm4 0l-1-1 3-3-3-3 1-1 4 4-4 4z',
  cinema: 'M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z',
  other: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z',
}

function buildMarkerSvg(category: string, color: string, isSelected: boolean): string {
  const size = isSelected ? 44 : 36
  const iconPath = CATEGORY_SVG_ICONS[category] || CATEGORY_SVG_ICONS.other
  const shadowOpacity = isSelected ? 0.3 : 0.15
  const strokeWidth = isSelected ? 2.5 : 2

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size / 2}" cy="${size / 2 + 1}" r="${size / 2 - 4}" fill="rgba(0,0,0,${shadowOpacity})" />
    <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 4}" fill="${color}" stroke="white" stroke-width="${strokeWidth}"/>
    <g transform="translate(${(size - 16) / 2}, ${(size - 16) / 2}) scale(0.667)" fill="white"><path d="${iconPath}"/></g>
  </svg>`
}

type RouteMode = 'auto' | 'pedestrian' | 'bicycle'

declare global {
  interface Window {
    ymaps: any
  }
}

export default function MapView({
  places,
  selectedPlaceId,
  onSelectPlace,
  routeTarget,
  onClearRoute,
  jsApiKey = '',
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const placemarkCollectionRef = useRef<any>(null)
  const routeRef = useRef<any>(null)
  const initedRef = useRef(false)

  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [placeSuggestions, setPlaceSuggestions] = useState<PlaceWithTags[]>([])
  const [geoSuggestions, setGeoSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestTimeoutRef = useRef<any>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Route state
  const [routeMode, setRouteMode] = useState<RouteMode>('pedestrian')
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null)
  const [showRoutePanel, setShowRoutePanel] = useState(false)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)

  // Navigator mode
  const [navigatorOpen, setNavigatorOpen] = useState(false)
  const [navFrom, setNavFrom] = useState('')
  const [navTo, setNavTo] = useState('')
  const [navFromCoords, setNavFromCoords] = useState<[number, number] | null>(null)
  const [navToCoords, setNavToCoords] = useState<[number, number] | null>(null)
  const [navFromSuggestions, setNavFromSuggestions] = useState<Array<{ name: string; coords: [number, number]; isPlace?: boolean }>>([])
  const [navToSuggestions, setNavToSuggestions] = useState<Array<{ name: string; coords: [number, number]; isPlace?: boolean }>>([])
  const [showNavFromSuggestions, setShowNavFromSuggestions] = useState(false)
  const [showNavToSuggestions, setShowNavToSuggestions] = useState(false)
  const navFromTimeoutRef = useRef<any>(null)
  const navToTimeoutRef = useRef<any>(null)

  // Controls
  const [controlsExpanded, setControlsExpanded] = useState(true)

  // Refs for callbacks
  const placesRef = useRef(places)
  placesRef.current = places
  const selectedPlaceIdRef = useRef(selectedPlaceId)
  selectedPlaceIdRef.current = selectedPlaceId
  const onSelectPlaceRef = useRef(onSelectPlace)
  onSelectPlaceRef.current = onSelectPlace

  // Close suggestions on click outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Init Yandex Maps 2.1
  useEffect(() => {
    if (initedRef.current || !mapContainerRef.current) return
    initedRef.current = true

    if (window.ymaps) {
      initMap()
      return
    }

    const script = document.createElement('script')
    const apiKeyParam = jsApiKey ? `&apikey=${jsApiKey}` : ''
    script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU${apiKeyParam}`
    script.async = true
    script.onload = () => { initMap() }
    document.head.appendChild(script)

    function initMap() {
      window.ymaps.ready(() => {
        if (!mapContainerRef.current) return

        const map = new window.ymaps.Map(mapContainerRef.current, {
          center: ROSTOV_OBLAST_CENTER,
          zoom: DEFAULT_ZOOM,
          controls: ['zoomControl'],
        }, {
          suppressMapOpenBlock: true,
        })

        mapRef.current = map
        const collection = new window.ymaps.GeoObjectCollection()
        map.geoObjects.add(collection)
        placemarkCollectionRef.current = collection
        addPlacemarks(placesRef.current)
      })
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
        initedRef.current = false
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addPlacemarks = useCallback(
    (placesToShow: PlaceWithTags[]) => {
      if (!mapRef.current || !window.ymaps || !placemarkCollectionRef.current) return
      placemarkCollectionRef.current.removeAll()

      placesToShow.forEach((place) => {
        const color = CATEGORY_COLORS[place.category] || '#6b7280'
        const isSelected = place.id === selectedPlaceIdRef.current
        const size = isSelected ? 44 : 36
        const svg = buildMarkerSvg(place.category, color, isSelected)

        const placemark = new window.ymaps.Placemark(
          [place.latitude, place.longitude],
          {
            hintContent: `${place.name} - ${CATEGORY_LABELS[place.category]}`,
            balloonContentHeader: place.name,
            balloonContentBody: `<div style="font-size:13px;">${place.address || ''}<br/>${place.description || ''}</div>`,
          },
          {
            iconLayout: 'default#imageWithContent',
            iconImageHref: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
            iconImageSize: [size, size],
            iconImageOffset: [-size / 2, -size / 2],
            iconContentOffset: [0, 0],
            zIndex: isSelected ? 1000 : 0,
          }
        )

        placemark.events.add('click', () => {
          onSelectPlaceRef.current(place)
        })

        placemarkCollectionRef.current.add(placemark)
      })
    },
    []
  )

  useEffect(() => {
    if (!mapRef.current || !window.ymaps) return
    addPlacemarks(places)
  }, [places, selectedPlaceId, addPlacemarks])

  useEffect(() => {
    if (!mapRef.current || !selectedPlaceId) return
    const place = places.find((p) => p.id === selectedPlaceId)
    if (place) {
      mapRef.current.setCenter([place.latitude, place.longitude], 16, { duration: 600 })
    }
  }, [selectedPlaceId, places])

  // Build route when target changes
  useEffect(() => {
    if (!routeTarget) {
      clearRoute()
      setShowRoutePanel(false)
      return
    }
    setShowRoutePanel(true)
    buildRoute(userLocation || ROSTOV_CENTER, [routeTarget.latitude, routeTarget.longitude])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeTarget, routeMode])

  function clearRoute() {
    if (routeRef.current && mapRef.current) {
      try { mapRef.current.geoObjects.remove(routeRef.current) } catch { /* ignore */ }
      routeRef.current = null
    }
    setRouteInfo(null)
  }

  async function buildRoute(from: [number, number], to: [number, number]) {
    if (!mapRef.current || !window.ymaps) return
    clearRoute()
    setRouteLoading(true)

    try {
      const multiRoute = new window.ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [from, to],
          params: { routingMode: routeMode },
        },
        {
          boundsAutoApply: true,
          routeActiveStrokeWidth: 5,
          routeActiveStrokeColor:
            routeMode === 'auto' ? '#3b82f6' :
            routeMode === 'pedestrian' ? '#10b981' :
            '#f59e0b',
        }
      )

      mapRef.current.geoObjects.add(multiRoute)
      routeRef.current = multiRoute

      multiRoute.model.events.add('requestsuccess', () => {
        try {
          const activeRoute = multiRoute.getActiveRoute()
          if (activeRoute) {
            const props = activeRoute.properties.getAll()
            setRouteInfo({
              distance: props.distance?.text || '',
              duration: props.duration?.text || '',
            })
          }
        } catch { /* ignore */ }
        setRouteLoading(false)
      })

      multiRoute.model.events.add('requesterror', () => {
        setRouteLoading(false)
      })
    } catch {
      setRouteLoading(false)
    }
  }

  // --- SEARCH: combines place data search + geocoder ---
  function handleSearchInput(value: string) {
    setSearchQuery(value)
    if (suggestTimeoutRef.current) clearTimeout(suggestTimeoutRef.current)

    if (!value.trim()) {
      setPlaceSuggestions([])
      setGeoSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Immediate local search through places
    const q = value.toLowerCase()
    const matchedPlaces = placesRef.current
      .filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.address && p.address.toLowerCase().includes(q)) ||
        CATEGORY_LABELS[p.category]?.toLowerCase().includes(q)
      )
      .slice(0, 8)
    setPlaceSuggestions(matchedPlaces)
    setShowSuggestions(true)

    // Debounced geocoder search
    suggestTimeoutRef.current = setTimeout(async () => {
      if (!window.ymaps) return
      const query = value.includes('Ростов') ? value : `${value}, Ростовская область`
      try {
        const result = await window.ymaps.geocode(query, {
          results: 5,
          boundedBy: [[46.0, 38.0], [49.0, 44.0]],
          strictBounds: false,
        })
        const items: any[] = []
        result.geoObjects.each((obj: any) => {
          items.push({
            name: obj.getAddressLine(),
            coords: obj.geometry.getCoordinates(),
          })
        })
        setGeoSuggestions(items)
        setShowSuggestions(true)
      } catch { /* geocode failed */ }
    }, 400)
  }

  function handleSelectPlaceSuggestion(place: PlaceWithTags) {
    setSearchQuery(place.name)
    setShowSuggestions(false)
    onSelectPlace(place)
    if (mapRef.current) {
      mapRef.current.setCenter([place.latitude, place.longitude], 17, { duration: 500 })
    }
  }

  function handleSelectGeoSuggestion(item: any) {
    if (!mapRef.current) return
    setSearchQuery(item.name?.split(',').slice(0, 2).join(', ') || item.name)
    setShowSuggestions(false)
    mapRef.current.setCenter(item.coords, 17, { duration: 500 })
  }

  function clearSearch() {
    setSearchQuery('')
    setPlaceSuggestions([])
    setGeoSuggestions([])
    setShowSuggestions(false)
  }

  // --- NAVIGATOR: search helper for from/to fields ---
  function searchForNavigator(
    value: string,
    setSuggestions: (s: Array<{ name: string; coords: [number, number]; isPlace?: boolean }>) => void,
    setShow: (b: boolean) => void,
    timeoutRef: React.MutableRefObject<any>,
  ) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (!value.trim()) {
      setSuggestions([])
      setShow(false)
      return
    }

    // Local place search
    const q = value.toLowerCase()
    const localMatches = placesRef.current
      .filter(p => p.name.toLowerCase().includes(q) || (p.address && p.address.toLowerCase().includes(q)))
      .slice(0, 5)
      .map(p => ({ name: `${p.name} (${p.address || ''})`, coords: [p.latitude, p.longitude] as [number, number], isPlace: true }))
    setSuggestions(localMatches)
    setShow(true)

    // Geocoder
    timeoutRef.current = setTimeout(async () => {
      if (!window.ymaps) return
      const query = value.includes('Ростов') ? value : `${value}, Ростовская область`
      try {
        const result = await window.ymaps.geocode(query, {
          results: 4,
          boundedBy: [[46.0, 38.0], [49.0, 44.0]],
        })
        const geoItems: Array<{ name: string; coords: [number, number]; isPlace?: boolean }> = []
        result.geoObjects.each((obj: any) => {
          geoItems.push({
            name: obj.getAddressLine(),
            coords: obj.geometry.getCoordinates(),
          })
        })
        setSuggestions([...localMatches, ...geoItems])
        setShow(true)
      } catch { /* ignore */ }
    }, 400)
  }

  function handleNavBuildRoute() {
    if (!navFromCoords || !navToCoords) return
    clearRoute()
    setShowRoutePanel(false)
    buildRoute(navFromCoords, navToCoords)
    setNavigatorOpen(false)
    setShowRoutePanel(true)
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(coords)
        setNavFromCoords(coords)
        setNavFrom('Моё местоположение')
      },
      () => { /* error */ }
    )
  }

  function handleLocateMe() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(coords)
        if (mapRef.current) {
          mapRef.current.setCenter(coords, 16, { duration: 500 })
        }
      },
      () => { /* error */ }
    )
  }

  const glassPanelClass = 'bg-card/90 backdrop-blur-xl border border-border shadow-lg rounded-xl'
  const hasSuggestions = placeSuggestions.length > 0 || geoSuggestions.length > 0

  return (
    <div className="relative h-full w-full">
      <style>{`
        .yandex-selected-marker { animation: pulse-marker 1.5s ease-in-out infinite; }
        @keyframes pulse-marker {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        [class*="ymaps-2-1"][class*="copyrights"] { font-size: 10px !important; }
      `}</style>

      {/* Map container */}
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        role="application"
        aria-label="Яндекс Карта доступных мест Ростовской области"
      />

      {/* ===== FLOATING CONTROLS ===== */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-col gap-2 pointer-events-none">
        {/* Search bar */}
        <div className="pointer-events-auto max-w-md mx-auto w-full relative" ref={searchRef}>
          <div className={`${glassPanelClass} flex items-center px-3 py-1.5 gap-2`}>
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => { if (hasSuggestions) setShowSuggestions(true) }}
              placeholder="Поиск мест, адресов, объектов..."
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-8 text-sm px-0"
            />
            {searchQuery && (
              <button onClick={clearSearch} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
            {/* Navigator button */}
            <button
              onClick={() => setNavigatorOpen(!navigatorOpen)}
              className={`shrink-0 flex items-center justify-center h-7 w-7 rounded-lg transition-colors ${
                navigatorOpen ? 'bg-primary text-primary-foreground' : 'text-primary hover:bg-secondary'
              }`}
              aria-label="Навигатор"
            >
              <Route className="h-4 w-4" />
            </button>
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && hasSuggestions && (
            <div className={`absolute top-full left-0 right-0 mt-1 ${glassPanelClass} py-1 max-h-80 overflow-y-auto`}>
              {/* Places from data */}
              {placeSuggestions.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Доступные места
                  </div>
                  {placeSuggestions.map((place) => (
                    <button
                      key={`place-${place.id}`}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/80 transition-colors flex items-start gap-2 text-foreground"
                      onClick={() => handleSelectPlaceSuggestion(place)}
                    >
                      <div
                        className="mt-1 h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[place.category] || '#6b7280' }}
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{place.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {CATEGORY_LABELS[place.category]} {place.address ? `\u2022 ${place.address}` : ''}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* Geocoder results */}
              {geoSuggestions.length > 0 && (
                <>
                  <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Адреса
                  </div>
                  {geoSuggestions.map((item, i) => (
                    <button
                      key={`geo-${i}`}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-secondary/80 transition-colors flex items-start gap-2 text-foreground"
                      onClick={() => handleSelectGeoSuggestion(item)}
                    >
                      <Navigation className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                      <span className="line-clamp-2">{item.name?.split(',').slice(0, 3).join(', ')}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>

        {/* Navigator panel */}
        {navigatorOpen && (
          <div className={`pointer-events-auto max-w-md mx-auto w-full ${glassPanelClass} p-3`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Route className="h-4 w-4 text-primary" />
                Навигатор
              </h3>
              <button
                onClick={() => setNavigatorOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* From */}
            <div className="relative mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent shrink-0" />
                <Input
                  value={navFrom}
                  onChange={(e) => {
                    setNavFrom(e.target.value)
                    searchForNavigator(e.target.value, setNavFromSuggestions, setShowNavFromSuggestions, navFromTimeoutRef)
                  }}
                  onFocus={() => { if (navFromSuggestions.length) setShowNavFromSuggestions(true) }}
                  placeholder="Откуда (адрес или место)"
                  className="h-8 text-sm"
                />
                <button
                  onClick={handleUseMyLocation}
                  className="shrink-0 text-primary hover:text-primary/80"
                  title="Моё местоположение"
                >
                  <Locate className="h-4 w-4" />
                </button>
              </div>
              {showNavFromSuggestions && navFromSuggestions.length > 0 && (
                <div className={`absolute top-full left-5 right-0 mt-1 ${glassPanelClass} py-1 max-h-48 overflow-y-auto z-10`}>
                  {navFromSuggestions.map((item, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary/80 transition-colors flex items-start gap-2 text-foreground"
                      onClick={() => {
                        setNavFrom(item.name.split(',').slice(0, 2).join(', '))
                        setNavFromCoords(item.coords)
                        setShowNavFromSuggestions(false)
                      }}
                    >
                      {item.isPlace ? <MapPin className="h-3 w-3 mt-0.5 text-primary shrink-0" /> : <Navigation className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />}
                      <span className="line-clamp-1">{item.name.split(',').slice(0, 3).join(', ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap arrow */}
            <div className="flex justify-center mb-2">
              <button
                onClick={() => {
                  setNavFrom(navTo)
                  setNavTo(navFrom)
                  setNavFromCoords(navToCoords)
                  setNavToCoords(navFromCoords)
                }}
                className="h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Поменять местами"
              >
                <ArrowRight className="h-3 w-3 rotate-90" />
              </button>
            </div>

            {/* To */}
            <div className="relative mb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary shrink-0" />
                <Input
                  value={navTo}
                  onChange={(e) => {
                    setNavTo(e.target.value)
                    searchForNavigator(e.target.value, setNavToSuggestions, setShowNavToSuggestions, navToTimeoutRef)
                  }}
                  onFocus={() => { if (navToSuggestions.length) setShowNavToSuggestions(true) }}
                  placeholder="Куда (адрес или место)"
                  className="h-8 text-sm"
                />
              </div>
              {showNavToSuggestions && navToSuggestions.length > 0 && (
                <div className={`absolute top-full left-5 right-0 mt-1 ${glassPanelClass} py-1 max-h-48 overflow-y-auto z-10`}>
                  {navToSuggestions.map((item, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-secondary/80 transition-colors flex items-start gap-2 text-foreground"
                      onClick={() => {
                        setNavTo(item.name.split(',').slice(0, 2).join(', '))
                        setNavToCoords(item.coords)
                        setShowNavToSuggestions(false)
                      }}
                    >
                      {item.isPlace ? <MapPin className="h-3 w-3 mt-0.5 text-primary shrink-0" /> : <Navigation className="h-3 w-3 mt-0.5 text-muted-foreground shrink-0" />}
                      <span className="line-clamp-1">{item.name.split(',').slice(0, 3).join(', ')}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Route type selector */}
            <div className="flex gap-1 mb-3">
              {([
                { mode: 'pedestrian' as RouteMode, icon: Footprints, label: 'Пешком' },
                { mode: 'auto' as RouteMode, icon: Car, label: 'Авто' },
                { mode: 'bicycle' as RouteMode, icon: Bus, label: 'Вело' },
              ]).map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setRouteMode(mode)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
                    routeMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Build route */}
            <Button
              onClick={handleNavBuildRoute}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!navFromCoords || !navToCoords}
            >
              <Route className="mr-2 h-4 w-4" />
              Построить маршрут
            </Button>

            {/* Route info inside navigator */}
            {routeInfo && !routeLoading && (
              <div className="flex items-center gap-3 p-2 mt-2 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-1 text-xs text-foreground">
                  <Ruler className="h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">{routeInfo.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-foreground">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  <span className="font-medium">{routeInfo.duration}</span>
                </div>
              </div>
            )}
            {routeLoading && (
              <div className="flex items-center justify-center py-2 mt-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span className="ml-2 text-xs text-muted-foreground">Строим маршрут...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Route panel (from place detail "build route" button) */}
      {showRoutePanel && routeTarget && !navigatorOpen && (
        <div className={`absolute top-16 right-3 z-[1000] w-72 ${glassPanelClass} p-3`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">Маршрут</h3>
            <button
              onClick={() => {
                onClearRoute()
                setShowRoutePanel(false)
                clearRoute()
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="h-2.5 w-2.5 rounded-full bg-accent shrink-0" />
            <span className="text-xs text-muted-foreground truncate flex-1">
              {userLocation ? 'Моё местоположение' : 'Центр Ростова-на-Дону'}
            </span>
            <button onClick={handleLocateMe} className="shrink-0 text-primary hover:text-primary/80">
              <Locate className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
            <span className="text-xs text-foreground truncate flex-1">{routeTarget.name}</span>
          </div>

          <div className="flex gap-1 mb-3">
            {([
              { mode: 'pedestrian' as RouteMode, icon: Footprints, label: 'Пешком' },
              { mode: 'auto' as RouteMode, icon: Car, label: 'Авто' },
              { mode: 'bicycle' as RouteMode, icon: Bus, label: 'Вело' },
            ]).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setRouteMode(mode)}
                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  routeMode === mode
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {routeInfo && !routeLoading && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-1 text-xs text-foreground">
                <Ruler className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{routeInfo.distance}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-foreground">
                <Clock className="h-3.5 w-3.5 text-accent" />
                <span className="font-medium">{routeInfo.duration}</span>
              </div>
            </div>
          )}

          {routeLoading && (
            <div className="flex items-center justify-center py-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="ml-2 text-xs text-muted-foreground">Строим маршрут...</span>
            </div>
          )}
        </div>
      )}

      {/* Bottom controls */}
      <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-2">
        <Button
          onClick={handleLocateMe}
          size="icon"
          variant="outline"
          className={`${glassPanelClass} h-9 w-9 text-foreground hover:bg-secondary/80 border-border`}
          aria-label="Моё местоположение"
        >
          <Locate className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className={`absolute bottom-3 right-3 z-[1000] ${glassPanelClass} overflow-hidden`}>
        <button
          onClick={() => setControlsExpanded(!controlsExpanded)}
          className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors"
        >
          <span>Категории</span>
          {controlsExpanded ? <ChevronDown className="h-3.5 w-3.5 ml-2" /> : <ChevronUp className="h-3.5 w-3.5 ml-2" />}
        </button>
        {controlsExpanded && (
          <div className="px-3 pb-2 grid grid-cols-2 gap-x-3 gap-y-0.5 max-h-48 overflow-y-auto">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5 py-0.5">
                <div
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[key as keyof typeof CATEGORY_COLORS] }}
                />
                <span className="text-[10px] text-muted-foreground truncate">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
