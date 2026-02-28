import {
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
} from 'ai'
import { z } from 'zod'

export const maxDuration = 30

const YANDEX_GEOCODE_URL = 'https://geocode-maps.yandex.ru/1.x/'
const YANDEX_SEARCH_URL = 'https://search-maps.yandex.ru/v1/'

// Tool: search for any place on the map via Yandex Geocoder
const searchPlaceTool = tool({
  description:
    'Search for any place, building, or address in Rostov-on-Don using Yandex Maps geocoder. Returns coordinates, address and name. Use this when the user asks about a specific place, building, or address.',
  inputSchema: z.object({
    query: z
      .string()
      .describe('The search query, e.g. "ТЦ Горизонт", "ул. Большая Садовая 47", "больница"'),
  }),
  execute: async ({ query }) => {
    try {
      const searchQuery = query.toLowerCase().includes('ростов')
        ? query
        : `Ростов-на-Дону, ${query}`

      const url = new URL(YANDEX_GEOCODE_URL)
      url.searchParams.set('geocode', searchQuery)
      url.searchParams.set('format', 'json')
      url.searchParams.set('results', '5')
      url.searchParams.set('lang', 'ru_RU')

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Geocode request failed')

      const data = await res.json()
      const members =
        data?.response?.GeoObjectCollection?.featureMember || []

      if (members.length === 0) {
        return { found: false, message: `Место "${query}" не найдено.` }
      }

      const results = members.map((m: any) => {
        const geo = m.GeoObject
        const pos = geo.Point.pos.split(' ')
        const coords = { lat: parseFloat(pos[1]), lng: parseFloat(pos[0]) }
        const name = geo.name || ''
        const description = geo.description || ''
        const kind =
          geo.metaDataProperty?.GeocoderMetaData?.kind || 'unknown'
        const address =
          geo.metaDataProperty?.GeocoderMetaData?.text || ''

        return { name, description, address, kind, coords }
      })

      return { found: true, count: results.length, results }
    } catch (err: any) {
      return { found: false, message: `Ошибка поиска: ${err.message}` }
    }
  },
})

// Tool: analyze accessibility of any building type
const analyzeAccessibilityTool = tool({
  description:
    'Analyze accessibility features of a place category (hospital, cafe, school, etc.). Returns typical accessibility features and recommendations for people with disabilities. Use this when user asks about accessibility of a type of place or specific venue.',
  inputSchema: z.object({
    placeType: z
      .string()
      .describe(
        'Type of the place to analyze, e.g. "больница", "школа", "кафе", "ТЦ", "парк"'
      ),
    placeName: z
      .string()
      .nullable()
      .describe('Optional specific name of the place'),
  }),
  execute: async ({ placeType, placeName }) => {
    // Knowledge base of typical accessibility features by category
    const accessibilityDb: Record<
      string,
      { typical: string[]; recommendations: string[]; rating: string }
    > = {
      'больница': {
        typical: [
          'Пандусы на входе',
          'Лифты между этажами',
          'Широкие коридоры и дверные проёмы',
          'Доступные санузлы',
          'Тактильная плитка',
          'Звуковое оповещение',
          'Кнопки вызова персонала',
        ],
        recommendations: [
          'Уточните наличие сурдопереводчика заранее',
          'Запросите сопровождение при входе',
          'Проверьте наличие парковки для инвалидов',
        ],
        rating: 'Средняя доступность (3.5-4.0)',
      },
      'поликлиника': {
        typical: [
          'Пандусы',
          'Лифты',
          'Широкие двери',
          'Доступные санузлы',
          'Поручни',
          'Тактильная навигация',
        ],
        recommendations: [
          'Запишитесь заранее для сопровождения',
          'Уточните работу лифтов',
        ],
        rating: 'Средняя доступность (3.5-4.0)',
      },
      'кафе': {
        typical: [
          'Пандус или ровный вход',
          'Широкие проходы между столами',
          'Меню с картинками',
          'Допуск собак-проводников',
        ],
        recommendations: [
          'Позвоните заранее для бронирования удобного столика',
          'Уточните наличие доступного санузла',
        ],
        rating: 'Выше среднего (4.0-4.5)',
      },
      'ресторан': {
        typical: [
          'Безбарьерный вход',
          'Низкие столики доступны',
          'Меню шрифтом Брайля (в некоторых)',
          'Обученный персонал',
        ],
        recommendations: [
          'Бронируйте столик на первом этаже',
          'Уточните наличие пандуса',
        ],
        rating: 'Выше среднего (4.0-4.5)',
      },
      'школа': {
        typical: [
          'Пандусы и подъёмники',
          'Лифты',
          'Сенсорные комнаты',
          'Инклюзивные классы',
          'Обученные педагоги',
          'Тактильная навигация',
        ],
        recommendations: [
          'Обратитесь к администрации для индивидуального плана',
          'Уточните наличие ассистента',
        ],
        rating: 'Хорошая доступность (4.0-4.5)',
      },
      'парк': {
        typical: [
          'Ровные асфальтированные дорожки',
          'Доступные скамейки',
          'Тактильные модели',
          'Сенсорные зоны',
          'Допуск собак-проводников',
        ],
        recommendations: [
          'Выбирайте маршруты по главным аллеям',
          'Проверьте доступность туалетов',
        ],
        rating: 'Хорошая доступность (4.0-4.5)',
      },
      'тц': {
        typical: [
          'Лифты и эскалаторы',
          'Пандусы',
          'Доступные санузлы на каждом этаже',
          'Парковка для инвалидов',
          'Индукционные петли',
          'Обученный персонал',
          'Автоматические двери',
        ],
        recommendations: [
          'Используйте лифты, а не эскалаторы',
          'Обратитесь к информационной стойке для помощи',
        ],
        rating: 'Высокая доступность (4.5-5.0)',
      },
      'банк': {
        typical: [
          'Пандус на входе',
          'Низкие стойки обслуживания',
          'Индукционные петли',
          'Текстовые терминалы',
          'Кнопки вызова',
        ],
        recommendations: [
          'Запишитесь на приём для сурдопереводчика',
          'Используйте кнопку вызова на входе',
        ],
        rating: 'Хорошая доступность (4.0-4.5)',
      },
      'аптека': {
        typical: [
          'Пандус',
          'Низкий прилавок',
          'Кнопка вызова фармацевта',
          'Крупные ценники',
        ],
        recommendations: [
          'Воспользуйтесь кнопкой вызова, если вход затруднён',
          'Попросите помощь фармацевта при выборе',
        ],
        rating: 'Средняя доступность (3.5-4.0)',
      },
      'музей': {
        typical: [
          'Тактильные модели экспонатов',
          'Аудиогиды',
          'Шрифт Брайля на табличках',
          'Лифты',
          'Обученный персонал',
        ],
        recommendations: [
          'Закажите экскурсию с сопровождением заранее',
          'Уточните наличие инвалидной коляски напрокат',
        ],
        rating: 'Хорошая доступность (4.0-4.5)',
      },
      'транспорт': {
        typical: [
          'Тактильная плитка на платформе',
          'Звуковое оповещение',
          'Визуальное расписание',
          'Низкопольный транспорт',
        ],
        recommendations: [
          'Используйте низкопольные автобусы и трамваи',
          'Обратитесь к водителю для помощи при посадке',
        ],
        rating: 'Средняя доступность (3.0-3.5)',
      },
    }

    // Find best match
    const normalizedType = placeType.toLowerCase()
    let match = accessibilityDb[normalizedType]
    if (!match) {
      // Try partial matching
      for (const [key, value] of Object.entries(accessibilityDb)) {
        if (normalizedType.includes(key) || key.includes(normalizedType)) {
          match = value
          break
        }
      }
    }

    if (!match) {
      return {
        placeType,
        placeName,
        info: 'Общие рекомендации по доступности',
        typical: [
          'Проверьте наличие пандуса на входе',
          'Уточните ширину дверных проёмов (нужно от 90 см)',
          'Спросите о наличии доступного санузла',
          'Узнайте о наличии лифта при многоэтажности',
        ],
        recommendations: [
          'Позвоните заранее для уточнения доступности',
          'Запросите сопровождение при необходимости',
          'Проверьте наличие парковки для инвалидов рядом',
        ],
        rating: 'Данных о доступности недостаточно',
      }
    }

    return {
      placeType,
      placeName,
      ...match,
    }
  },
})

// Tool: get nearby accessible places by category
const getNearbyPlacesTool = tool({
  description:
    'Search for accessible places of a specific category near given coordinates or in a specific area of Rostov-on-Don. Use when user asks for nearby cafes, hospitals, pharmacies etc.',
  inputSchema: z.object({
    category: z
      .string()
      .describe('Category like "кафе", "больница", "аптека", "магазин", "парк"'),
    area: z
      .string()
      .nullable()
      .describe('Optional area description like "центр", "Западный", "Северный"'),
  }),
  execute: async ({ category, area }) => {
    const searchText = area
      ? `${category} Ростов-на-Дону ${area}`
      : `${category} Ростов-на-Дону`

    try {
      const url = new URL(YANDEX_GEOCODE_URL)
      url.searchParams.set('geocode', searchText)
      url.searchParams.set('format', 'json')
      url.searchParams.set('results', '8')
      url.searchParams.set('lang', 'ru_RU')
      url.searchParams.set('bbox', '39.5,47.1~39.9,47.4')
      url.searchParams.set('rspn', '1')

      const res = await fetch(url.toString())
      if (!res.ok) throw new Error('Search failed')

      const data = await res.json()
      const members =
        data?.response?.GeoObjectCollection?.featureMember || []

      const results = members.map((m: any) => {
        const geo = m.GeoObject
        const pos = geo.Point.pos.split(' ')
        return {
          name: geo.name,
          address: geo.metaDataProperty?.GeocoderMetaData?.text || '',
          coords: { lat: parseFloat(pos[1]), lng: parseFloat(pos[0]) },
        }
      })

      return {
        found: results.length > 0,
        category,
        area: area || 'весь город',
        count: results.length,
        results,
      }
    } catch (err: any) {
      return {
        found: false,
        message: `Ошибка поиска: ${err.message}`,
      }
    }
  },
})

// Tool: get route info between two places
const getRouteInfoTool = tool({
  description:
    'Get route information (distance, estimated time) between two places in Rostov-on-Don. Use when user asks how to get somewhere or asks about distance/time.',
  inputSchema: z.object({
    from: z
      .string()
      .describe('Starting point address or name'),
    to: z
      .string()
      .describe('Destination address or name'),
    mode: z
      .enum(['walking', 'driving', 'transit'])
      .describe('Travel mode'),
  }),
  execute: async ({ from, to, mode }) => {
    // We'll use geocoding to get coordinates, then estimate
    try {
      const geocode = async (query: string) => {
        const searchQ = query.toLowerCase().includes('ростов')
          ? query
          : `Ростов-на-Дону, ${query}`
        const url = new URL(YANDEX_GEOCODE_URL)
        url.searchParams.set('geocode', searchQ)
        url.searchParams.set('format', 'json')
        url.searchParams.set('results', '1')
        url.searchParams.set('lang', 'ru_RU')

        const res = await fetch(url.toString())
        const data = await res.json()
        const member =
          data?.response?.GeoObjectCollection?.featureMember?.[0]
        if (!member) return null
        const pos = member.GeoObject.Point.pos.split(' ')
        return {
          lat: parseFloat(pos[1]),
          lng: parseFloat(pos[0]),
          name: member.GeoObject.name,
          address: member.GeoObject.metaDataProperty?.GeocoderMetaData?.text,
        }
      }

      const fromGeo = await geocode(from)
      const toGeo = await geocode(to)

      if (!fromGeo || !toGeo) {
        return { error: 'Не удалось определить координаты одного из мест.' }
      }

      // Calculate approximate distance
      const R = 6371 // km
      const dLat = ((toGeo.lat - fromGeo.lat) * Math.PI) / 180
      const dLon = ((toGeo.lng - fromGeo.lng) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((fromGeo.lat * Math.PI) / 180) *
          Math.cos((toGeo.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      const straightDistance = R * c

      // Approximate road distance (typically 1.3-1.5x straight line)
      const roadDistance = straightDistance * 1.4

      const speeds = { walking: 5, driving: 30, transit: 20 }
      const speed = speeds[mode]
      const timeHours = roadDistance / speed
      const timeMinutes = Math.round(timeHours * 60)

      return {
        from: { name: fromGeo.name, address: fromGeo.address, coords: { lat: fromGeo.lat, lng: fromGeo.lng } },
        to: { name: toGeo.name, address: toGeo.address, coords: { lat: toGeo.lat, lng: toGeo.lng } },
        mode,
        distance: `${roadDistance.toFixed(1)} км`,
        estimatedTime: timeMinutes < 60
          ? `${timeMinutes} мин`
          : `${Math.floor(timeMinutes / 60)} ч ${timeMinutes % 60} мин`,
        tip:
          mode === 'walking'
            ? 'Рекомендуем использовать главные улицы с пониженными бордюрами и тактильной плиткой.'
            : mode === 'transit'
            ? 'Выбирайте низкопольный транспорт. Уточните маршруты на остановке.'
            : 'Проверьте наличие парковки для инвалидов у точки назначения.',
      }
    } catch (err: any) {
      return { error: `Ошибка расчёта маршрута: ${err.message}` }
    }
  },
})

const tools = {
  searchPlace: searchPlaceTool,
  analyzeAccessibility: analyzeAccessibilityTool,
  getNearbyPlaces: getNearbyPlacesTool,
  getRouteInfo: getRouteInfoTool,
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: 'openai/gpt-5-mini',
    system: `Ты -- ДоступРостов AI, интеллектуальный помощник по доступной среде города Ростов-на-Дону.

Твои возможности:
1. **Поиск мест** -- найди любое здание, учреждение или адрес в Ростове-на-Дону через карту
2. **Анализ доступности** -- оцени доступность любого типа заведения для людей с инвалидностью (пандусы, лифты, тактильная плитка, и др.)
3. **Поиск ближайших мест** -- найди кафе, больницы, аптеки и другие заведения рядом
4. **Построение маршрута** -- рассчитай расстояние и время пути между точками

Правила:
- Всегда отвечай на русском языке
- Давай конкретные, полезные советы по доступности
- Если пользователь спрашивает о конкретном месте, используй инструмент поиска
- Указывай теги доступности: пандус, лифт, тактильная плитка, индукционная петля, шрифт Брайля, и т.д.
- Будь дружелюбным и поддерживающим
- Если не знаешь точную информацию о конкретном здании, предложи общие рекомендации для данного типа заведения и порекомендуй позвонить заранее
- Используй форматирование: **жирный** для важных вещей, списки для перечислений`,
    messages: await convertToModelMessages(messages),
    tools,
    maxSteps: 5,
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse()
}
