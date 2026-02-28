import type { PlaceWithTags, AccessibilityTag, Review } from '@/lib/types'

export const mockTags: AccessibilityTag[] = [
  // --- Мобильность (mobility) ---
  { id: 1,  name: 'Пандус',                slug: 'ramp',              icon: null, disability_category: 'mobility', description: 'Пандус для инвалидных колясок' },
  { id: 2,  name: 'Лифт',                  slug: 'elevator',          icon: null, disability_category: 'mobility', description: 'Доступный лифт' },
  { id: 3,  name: 'Широкие двери',          slug: 'wide-doors',        icon: null, disability_category: 'mobility', description: 'Дверные проёмы шире 90 см' },
  { id: 4,  name: 'Доступный туалет',       slug: 'accessible-wc',     icon: null, disability_category: 'mobility', description: 'Санузел для людей на коляске' },
  { id: 5,  name: 'Парковка для инвалидов', slug: 'disabled-parking',  icon: null, disability_category: 'mobility', description: 'Выделенные парковочные места' },
  { id: 6,  name: 'Ровный пол',             slug: 'flat-floor',        icon: null, disability_category: 'mobility', description: 'Без порогов и ступеней' },
  { id: 7,  name: 'Подъёмник',              slug: 'platform-lift',     icon: null, disability_category: 'mobility', description: 'Вертикальный или наклонный подъёмник' },
  { id: 8,  name: 'Низкие прилавки',        slug: 'low-counter',       icon: null, disability_category: 'mobility', description: 'Прилавки и стойки доступной высоты' },
  { id: 9,  name: 'Поручни',                slug: 'handrails',         icon: null, disability_category: 'mobility', description: 'Поручни в коридорах и на лестницах' },
  { id: 10, name: 'Кнопка вызова',          slug: 'call-button',       icon: null, disability_category: 'mobility', description: 'Кнопка вызова сотрудника на входе' },
  { id: 11, name: 'Автоматические двери',   slug: 'auto-doors',        icon: null, disability_category: 'mobility', description: 'Двери с автоматическим открыванием' },
  { id: 12, name: 'Электроколяска',         slug: 'power-wheelchair',  icon: null, disability_category: 'mobility', description: 'Возможность зарядки электроколяски' },
  { id: 34, name: 'Адаптивное оборудование', slug: 'adaptive-equip',   icon: null, disability_category: 'mobility', description: 'Специальное адаптивное оборудование для людей с ОВЗ' },
  { id: 35, name: 'Пеленальный столик',     slug: 'changing-table',    icon: null, disability_category: 'mobility', description: 'Пеленальный столик в доступном санузле' },
  { id: 36, name: 'Специальные места',      slug: 'wheelchair-seats',  icon: null, disability_category: 'mobility', description: 'Специальные места для инвалидных колясок в зале' },
  { id: 37, name: 'Низкий унитаз',          slug: 'low-toilet',        icon: null, disability_category: 'mobility', description: 'Унитаз со сниженной высотой и поручнями' },
  { id: 38, name: 'Доступная кабинка',      slug: 'accessible-cabin',  icon: null, disability_category: 'mobility', description: 'Увеличенная кабинка для колясок' },

  // --- Зрение (vision) ---
  { id: 13, name: 'Тактильная плитка',      slug: 'tactile-tiles',     icon: null, disability_category: 'vision', description: 'Тактильная навигационная плитка' },
  { id: 14, name: 'Шрифт Брайля',           slug: 'braille',           icon: null, disability_category: 'vision', description: 'Информация шрифтом Брайля' },
  { id: 15, name: 'Контрастная разметка',    slug: 'contrast-marking',  icon: null, disability_category: 'vision', description: 'Контрастная маркировка ступеней и дверей' },
  { id: 16, name: 'Звуковые сигналы',        slug: 'audio-signals',     icon: null, disability_category: 'vision', description: 'Звуковые сигналы на светофорах и дверях' },
  { id: 17, name: 'Говорящий лифт',          slug: 'talking-elevator',  icon: null, disability_category: 'vision', description: 'Голосовое объявление этажей в лифте' },
  { id: 18, name: 'Крупный шрифт',           slug: 'large-print',       icon: null, disability_category: 'vision', description: 'Вывески и указатели крупным шрифтом' },
  { id: 19, name: 'Аудиогид',                slug: 'audio-guide',       icon: null, disability_category: 'vision', description: 'Аудиоописание или аудиогид' },
  { id: 20, name: 'Собака-проводник',        slug: 'guide-dog',         icon: null, disability_category: 'vision', description: 'Допуск собаки-проводника' },
  { id: 21, name: 'Тактильные модели',       slug: 'tactile-models',    icon: null, disability_category: 'vision', description: 'Макеты и рельефные схемы зданий' },
  { id: 39, name: 'Тифлокомментирование',   slug: 'audio-description', icon: null, disability_category: 'vision', description: 'Тифлокомментирование спектаклей и фильмов' },
  { id: 40, name: 'Рельефные указатели',     slug: 'relief-signs',      icon: null, disability_category: 'vision', description: 'Объёмные рельефные указатели на стенах' },

  // --- Слух (hearing) ---
  { id: 22, name: 'Индукционная петля',     slug: 'induction-loop',    icon: null, disability_category: 'hearing', description: 'Индукционная петля для слуховых аппаратов' },
  { id: 23, name: 'Субтитры',               slug: 'subtitles',         icon: null, disability_category: 'hearing', description: 'Информационные экраны с субтитрами' },
  { id: 24, name: 'Визуальные оповещения',  slug: 'visual-alerts',     icon: null, disability_category: 'hearing', description: 'Световая сигнализация и визуальные табло' },
  { id: 25, name: 'Сурдопереводчик',        slug: 'sign-interpreter',  icon: null, disability_category: 'hearing', description: 'Доступен переводчик жестового языка' },
  { id: 26, name: 'Виброоповещение',        slug: 'vibro-alert',       icon: null, disability_category: 'hearing', description: 'Система вибрационных оповещений' },
  { id: 27, name: 'Текстовый терминал',     slug: 'text-terminal',     icon: null, disability_category: 'hearing', description: 'Терминал для текстовой связи' },
  { id: 41, name: 'FM-система',             slug: 'fm-system',         icon: null, disability_category: 'hearing', description: 'FM-система усиления звука для слабослышащих' },

  // --- Когнитивные (cognitive) ---
  { id: 28, name: 'Простая навигация',      slug: 'simple-nav',        icon: null, disability_category: 'cognitive', description: 'Интуитивные указатели и пиктограммы' },
  { id: 29, name: 'Тихое место',            slug: 'quiet-space',       icon: null, disability_category: 'cognitive', description: 'Зона с низким уровнем шума' },
  { id: 30, name: 'Визуальное расписание',  slug: 'visual-schedule',   icon: null, disability_category: 'cognitive', description: 'Наглядное расписание с картинками' },
  { id: 31, name: 'Обученный персонал',     slug: 'trained-staff',     icon: null, disability_category: 'cognitive', description: 'Сотрудники обучены работе с людьми с ОВЗ' },
  { id: 32, name: 'Сенсорная комната',      slug: 'sensory-room',      icon: null, disability_category: 'cognitive', description: 'Специальная комната для сенсорной разгрузки' },
  { id: 33, name: 'Понятное меню',          slug: 'easy-menu',         icon: null, disability_category: 'cognitive', description: 'Меню или каталог с иллюстрациями' },
  { id: 42, name: 'Социальная история',     slug: 'social-story',      icon: null, disability_category: 'cognitive', description: 'Социальная история для подготовки к посещению' },
]

const t = (id: number) => mockTags.find((tag) => tag.id === id)!

// ========== Seeded RNG for deterministic generation ==========
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

// ========== Города и населённые пункты Ростовской области ==========
interface CityDef {
  name: string
  lat: number
  lng: number
  radius: number // km spread
  weight: number // relative number of places
}

const ROSTOV_OBLAST_CITIES: CityDef[] = [
  // Крупные города
  { name: 'Ростов-на-Дону', lat: 47.2357, lng: 39.7015, radius: 0.08, weight: 18 },
  { name: 'Таганрог', lat: 47.2362, lng: 38.8967, radius: 0.04, weight: 8 },
  { name: 'Шахты', lat: 47.7085, lng: 40.2148, radius: 0.03, weight: 6 },
  { name: 'Волгодонск', lat: 47.5137, lng: 42.1498, radius: 0.03, weight: 6 },
  { name: 'Новочеркасск', lat: 47.4220, lng: 40.0936, radius: 0.03, weight: 6 },
  { name: 'Батайск', lat: 47.1389, lng: 39.7494, radius: 0.02, weight: 5 },
  { name: 'Новошахтинск', lat: 47.7571, lng: 39.9324, radius: 0.02, weight: 4 },
  { name: 'Каменск-Шахтинский', lat: 48.3171, lng: 40.2598, radius: 0.02, weight: 4 },
  { name: 'Азов', lat: 47.0935, lng: 39.4165, radius: 0.02, weight: 4 },
  { name: 'Гуково', lat: 48.0547, lng: 39.9393, radius: 0.015, weight: 3 },
  { name: 'Донецк', lat: 48.3371, lng: 39.9535, radius: 0.015, weight: 3 },
  { name: 'Сальск', lat: 46.4731, lng: 41.5407, radius: 0.02, weight: 3 },
  { name: 'Миллерово', lat: 48.9243, lng: 40.3936, radius: 0.015, weight: 3 },
  { name: 'Красный Сулин', lat: 47.8835, lng: 40.0651, radius: 0.015, weight: 3 },
  { name: 'Аксай', lat: 47.2682, lng: 39.8694, radius: 0.015, weight: 3 },
  { name: 'Белая Калитва', lat: 48.1869, lng: 40.7831, radius: 0.015, weight: 2 },
  { name: 'Морозовск', lat: 48.3536, lng: 41.8300, radius: 0.015, weight: 2 },
  { name: 'Семикаракорск', lat: 47.5166, lng: 40.8104, radius: 0.015, weight: 2 },
  { name: 'Зерноград', lat: 46.8450, lng: 40.3095, radius: 0.015, weight: 2 },
  { name: 'Константиновск', lat: 47.5781, lng: 41.0990, radius: 0.01, weight: 2 },
  { name: 'Цимлянск', lat: 47.6460, lng: 42.0948, radius: 0.01, weight: 2 },
  { name: 'Пролетарск', lat: 46.7031, lng: 41.7266, radius: 0.01, weight: 2 },
  { name: 'Зверево', lat: 48.0216, lng: 40.1282, radius: 0.01, weight: 1 },
  { name: 'Усть-Донецкий', lat: 47.6210, lng: 40.8510, radius: 0.01, weight: 1 },
  // Средние посёлки и станицы
  { name: 'Матвеев Курган', lat: 47.5570, lng: 38.8310, radius: 0.01, weight: 1 },
  { name: 'Куйбышево', lat: 47.6480, lng: 38.9270, radius: 0.01, weight: 1 },
  { name: 'Чалтырь', lat: 47.2800, lng: 39.5580, radius: 0.01, weight: 1 },
  { name: 'Большая Мартыновка', lat: 46.9550, lng: 41.1070, radius: 0.01, weight: 1 },
  { name: 'Весёлый', lat: 46.8660, lng: 40.7560, radius: 0.01, weight: 1 },
  { name: 'Егорлыкская', lat: 46.5660, lng: 40.6500, radius: 0.01, weight: 1 },
  { name: 'Песчанокопское', lat: 46.1920, lng: 40.8720, radius: 0.01, weight: 1 },
  { name: 'Целина', lat: 46.5330, lng: 41.0380, radius: 0.01, weight: 1 },
  { name: 'Орловский', lat: 46.8750, lng: 42.0580, radius: 0.01, weight: 1 },
  { name: 'Ремонтное', lat: 46.5590, lng: 43.6530, radius: 0.01, weight: 1 },
  { name: 'Заветное', lat: 47.1180, lng: 43.8940, radius: 0.01, weight: 1 },
  { name: 'Зимовники', lat: 47.1450, lng: 42.4720, radius: 0.01, weight: 1 },
  { name: 'Дубовское', lat: 47.3300, lng: 42.7520, radius: 0.01, weight: 1 },
  { name: 'Тацинская', lat: 48.1940, lng: 41.1370, radius: 0.01, weight: 1 },
  { name: 'Обливская', lat: 48.5310, lng: 42.5190, radius: 0.01, weight: 1 },
  { name: 'Кашары', lat: 49.0140, lng: 40.2340, radius: 0.01, weight: 1 },
  { name: 'Вёшенская', lat: 49.6290, lng: 41.7260, radius: 0.01, weight: 1 },
  { name: 'Боковская', lat: 49.2420, lng: 41.1680, radius: 0.01, weight: 1 },
  { name: 'Чертково', lat: 48.5070, lng: 40.1250, radius: 0.01, weight: 1 },
  { name: 'Мясниковская', lat: 47.2960, lng: 39.5900, radius: 0.01, weight: 1 },
  { name: 'Покровское', lat: 47.5230, lng: 39.3160, radius: 0.01, weight: 1 },
  { name: 'Родионово-Несветайская', lat: 47.4380, lng: 39.8730, radius: 0.01, weight: 1 },
  { name: 'Багаевская', lat: 47.3150, lng: 40.3660, radius: 0.01, weight: 1 },
]

// ========== Шаблоны мест по категориям ==========
type CatKey = 'cafe' | 'restaurant' | 'hospital' | 'clinic' | 'pharmacy' | 'shop' | 'bank' | 'park' | 'crossing' | 'transport_stop' | 'government' | 'education' | 'culture' | 'sport' | 'toilet' | 'theater' | 'cinema'

interface PlaceTemplate {
  category: CatKey
  names: string[]
  descriptions: string[]
  tagSets: number[][]
  workingHours: string[]
}

const TEMPLATES: PlaceTemplate[] = [
  {
    category: 'cafe',
    names: ['Кафе "Уют"','Кафе "Лагуна"','Кафе "Мята"','Кафе "Берёзка"','Кафе "Встреча"','Кафе "Аромат"','Кафе "Фиалка"','Кофейня "Зерно"','Кафе "Сирень"','Кафе "Оазис"','Кафе "Каприз"','Кафе "Ватрушка"','Кафе "Корица"','Кафе "Базилик"','Кафе "Веранда"','Кафе "Бриз"','Кафе "Орхидея"','Кафе "Малина"','Кафе "Калина"','Кафе "Рубин"'],
    descriptions: ['Уютное кафе с ровным входом и широкими проходами.','Кафе с пандусом, низкими столиками и адаптированным меню.','Кофейня с доступным входом и обученным персоналом.','Кафе с кнопкой вызова сотрудника и понятным меню с картинками.','Кафе с безбарьерным входом и доступным санузлом.','Кафе-кондитерская с ровным полом и низкими витринами.'],
    tagSets: [[1,3,6,8,31,33],[1,3,6,8,31],[1,6,8,33],[1,3,4,6,8,10,31,33],[1,3,6,8,20,31],[1,6,8,10,33,31]],
    workingHours: ['07:00-22:00','08:00-21:00','08:00-23:00','09:00-22:00','07:30-21:00','10:00-22:00'],
  },
  {
    category: 'restaurant',
    names: ['Ресторан "Дон"','Ресторан "Станица"','Ресторан "Казачий стол"','Ресторан "Палуба"','Ресторан "Лимон"','Ресторан "Южный"','Ресторан "Аист"','Ресторан "Золотой колос"','Ресторан "Стерлядь"','Ресторан "Панорама"','Ресторан "Гурман"','Ресторан "Камелот"','Ресторан "Граф"','Ресторан "Донской причал"','Ресторан "Хуторок"','Ресторан "Олива"','Ресторан "Восток"','Ресторан "Речной"','Ресторан "Бригантина"','Ресторан "Урожай"'],
    descriptions: ['Ресторан с безбарьерным входом, доступным санузлом и обученным персоналом.','Ресторан с пандусом и низкими прилавками.','Ресторан с широкими дверями и доступным залом.','Ресторан с подъёмником и адаптированным меню.','Ресторан с ровным входом и кнопкой вызова.'],
    tagSets: [[1,3,4,6,8,31,33],[1,3,6,8,31],[1,3,4,6,8,14,20,31,33],[1,2,3,4,8,10,17,31],[1,7,3,4,8,31,33]],
    workingHours: ['11:00-23:00','12:00-00:00','11:00-00:00','10:00-22:00','11:00-01:00'],
  },
  {
    category: 'hospital',
    names: ['Больница N','ЦРБ','Районная больница','Городская больница N','Медицинский центр'],
    descriptions: ['Больница с лифтами, доступными палатами и подъёмниками.','Центральная районная больница с безбарьерной средой.','Больница с полной доступностью и обученным персоналом.'],
    tagSets: [[1,2,3,4,5,7,9,11,13,17,22,31],[1,2,3,4,7,9,13,17,31],[1,2,3,4,5,6,7,9,11,13,17,22,24,31]],
    workingHours: ['Круглосуточно'],
  },
  {
    category: 'clinic',
    names: ['Поликлиника N','Детская поликлиника','Стоматологическая поликлиника','Амбулатория','Женская консультация'],
    descriptions: ['Поликлиника с лифтом и электронной очередью.','Поликлиника с пандусом, кнопкой вызова и доступным санузлом.','Поликлиника с индукционной петлёй и обученным персоналом.'],
    tagSets: [[1,2,3,4,7,9,10,13,17,22,31],[1,3,4,9,10,22,31],[1,2,3,4,9,13,17,22,25,28,31]],
    workingHours: ['08:00-18:00','07:30-19:00','08:00-20:00'],
  },
  {
    category: 'pharmacy',
    names: ['Аптека "Здоровье"','Аптека "Ригла"','Аптека "Социальная"','Аптека "Максавит"','Аптека "Фармация"','Аптека "Доктор Столетов"','Аптека "Планета здоровья"','Аптека "Апрель"','Аптека "Будь здоров"','Аптека "Фармленд"'],
    descriptions: ['Аптека с пандусом, кнопкой вызова и низким прилавком.','Аптека с автоматическими дверями и крупными ценниками.','Аптека с ровным входом и обученным персоналом.'],
    tagSets: [[1,6,8,10,18],[1,6,8,11,18],[1,6,8,10,15,18],[1,6,8,18,31]],
    workingHours: ['08:00-21:00','08:00-22:00','Круглосуточно','09:00-20:00'],
  },
  {
    category: 'shop',
    names: ['Магнит','Пятёрочка','Перекрёсток','ТЦ "Южный"','ТЦ "Центральный"','Магазин "Светофор"','ТЦ "Галерея"','Магазин "Фикс Прайс"','ТЦ "Триумф"','Магазин "Красное и Белое"','Магазин "DNS"','Магазин "Спортмастер"','ТЦ "Радуга"','Магазин "Детский мир"','Магазин "Ашан"'],
    descriptions: ['Магазин с ровным входом и широкими проходами.','Торговый центр с лифтами и доступными санузлами.','Супермаркет с автоматическими дверями и парковкой для инвалидов.','Магазин с пандусом и обученным персоналом.'],
    tagSets: [[1,3,6,8,15],[1,2,3,4,5,6,7,8,11,13,17,28,31],[1,3,5,6,8,11,15,28],[1,3,6,8,28,31]],
    workingHours: ['07:00-23:00','08:00-22:00','09:00-21:00','10:00-22:00'],
  },
  {
    category: 'bank',
    names: ['Сбербанк','ВТБ','Альфа-Банк','Т-Банк','Россельхозбанк','Центр-Инвест','Газпромбанк','Почта Банк','Райффайзен','Совкомбанк'],
    descriptions: ['Отделение банка с пандусом и индукционной петлёй.','Банк с кнопкой вызова и текстовым терминалом.','Банк с автоматическими дверями и электронной очередью.'],
    tagSets: [[1,3,6,8,10,11,15,22,25,27,28,31],[1,3,6,8,10,27,28,31],[1,3,6,8,11,28,31]],
    workingHours: ['09:00-18:00, Пн-Пт','09:00-19:00, Пн-Пт','09:00-20:00, Пн-Сб'],
  },
  {
    category: 'park',
    names: ['Городской парк','Парк культуры','Сквер Победы','Парк "Дружба"','Парк "Молодёжный"','Сквер им. Пушкина','Парк отдыха','Сквер "Центральный"','Парк "Приречный"','Аллея Славы','Сквер им. Горького','Парк "Юбилейный"'],
    descriptions: ['Парк с ровными дорожками и доступными площадками.','Сквер с тактильной навигацией и зонами отдыха.','Парк с доступными аллеями и обученным персоналом.'],
    tagSets: [[6,9,13,15,28,29],[6,9,13,15,20,28,29],[1,6,9,13,15,19,20,21,28,29,32]],
    workingHours: ['Круглосуточно','06:00-23:00','08:00-22:00'],
  },
  {
    category: 'crossing',
    names: ['Переход','Пешеходный переход','Регулируемый переход','Подземный переход','Надземный переход'],
    descriptions: ['Переход с тактильной плиткой и звуковым светофором.','Подземный переход с лифтом и тактильной навигацией.','Регулируемый переход с виброоповещением и контрастной разметкой.'],
    tagSets: [[6,13,15,16,26],[2,6,13,15,16,17,26],[6,13,15,16,26]],
    workingHours: ['Круглосуточно'],
  },
  {
    category: 'transport_stop',
    names: ['Остановка "Центр"','Остановка "Рынок"','Остановка "Площадь"','Остановка "Вокзал"','Остановка "Больница"','Остановка "Школа"','Автовокзал','Ж/д станция','Остановка "Парк"','Остановка "Администрация"'],
    descriptions: ['Остановка с тактильной плиткой и электронным табло.','Транспортный узел с доступной средой и лифтами.','Остановка с визуальным расписанием и низкопольным транспортом.'],
    tagSets: [[6,13,15,16,24,30],[1,2,4,5,6,7,9,13,15,16,17,22,24,28,30,31],[6,13,15,24,30]],
    workingHours: ['Круглосуточно','05:00-00:00'],
  },
  {
    category: 'government',
    names: ['МФЦ','Администрация','Почта России','ЗАГС','Пенсионный фонд','Центр занятости','Налоговая инспекция','Соцзащита','Паспортный стол','ГИБДД'],
    descriptions: ['Госучреждение с полной доступной средой и обученным персоналом.','Учреждение с пандусом, лифтом и электронной очередью.','Государственный центр с кнопкой вызова и доступным входом.'],
    tagSets: [[1,2,3,4,5,7,8,9,11,13,14,17,18,22,24,25,27,28,30,31],[1,2,3,4,7,8,9,11,13,17,22,25,28,31],[1,6,8,10,15,28,31]],
    workingHours: ['08:00-20:00, Пн-Сб','09:00-17:00, Пн-Пт','08:00-18:00, Пн-Пт'],
  },
  {
    category: 'education',
    names: ['Школа N','Детский сад N','Гимназия N','Лицей N','Колледж','Техникум','Школа искусств','Библиотека','Музыкальная школа','Спортивная школа'],
    descriptions: ['Учебное заведение с инклюзивной средой и сенсорной комнатой.','Образовательное учреждение с лифтами и доступными классами.','Школа с подъёмниками и обученным персоналом.'],
    tagSets: [[1,2,3,4,7,9,13,22,28,31,32],[1,2,4,7,9,13,17,28,31,32,34],[1,2,3,4,7,9,13,14,17,22,28,29,31,32,34]],
    workingHours: ['08:00-18:00','08:00-17:00','09:00-20:00'],
  },
  {
    category: 'culture',
    names: ['Музей','Дом культуры','Выставочный зал','Краеведческий музей','Галерея','Центр народного творчества','Библиотека','Музей истории','Культурный центр','Арт-пространство'],
    descriptions: ['Культурное учреждение с тактильными экспонатами и аудиогидом.','Дом культуры с подъёмником и доступным залом.','Музей с аудиоописанием и обученным персоналом.'],
    tagSets: [[1,2,4,7,13,14,17,19,20,21,28,29,31],[1,2,4,7,9,22,28,31,36],[1,6,14,19,21,28,31]],
    workingHours: ['10:00-18:00, Вт-Вс','10:00-20:00','09:00-17:00, Пн-Сб'],
  },
  {
    category: 'sport',
    names: ['Спорткомплекс','Бассейн','Стадион','Фитнес-центр','Спортзал','Ледовый дворец','Теннисный центр','Спортивная арена','Физкультурный центр','Дворец спорта'],
    descriptions: ['Спортивный объект с адаптивными программами и подъёмниками.','Спорткомплекс с доступными раздевалками и обученным персоналом.','Спортивное сооружение с местами для колясок и доступной инфраструктурой.'],
    tagSets: [[1,2,3,4,5,7,9,11,13,17,22,28,31,34],[1,2,4,7,9,11,31,34],[1,2,4,5,7,9,11,13,17,22,24,28,31,36]],
    workingHours: ['07:00-22:00','06:00-23:00','По расписанию'],
  },
  {
    category: 'toilet',
    names: ['Общественный туалет','Доступный санузел','Туалет в парке','Туалет у вокзала','Модульный туалет','Туалет у рынка','Туалет на площади','Туалет в ТЦ','Туалет у администрации','Туалет у больницы'],
    descriptions: ['Доступный общественный туалет с поручнями и увеличенной кабинкой.','Модульный туалет с доступной кабинкой и пеленальным столиком.','Общественный санузел с автоматическими дверями и поручнями.'],
    tagSets: [[1,4,6,9,37,38,35],[1,4,6,37,38],[1,4,6,9,11,37,38,35]],
    workingHours: ['07:00-22:00','08:00-21:00','Круглосуточно'],
  },
  {
    category: 'theater',
    names: ['Театр драмы','Молодёжный театр','Театр кукол','ДК','Концертный зал','Театр юного зрителя','Народный театр','Камерный театр'],
    descriptions: ['Театр с местами для колясок и индукционной петлёй.','Театр с подъёмником, тифлокомментированием и сурдопереводом.','Камерный театр с пандусом и доступными местами в партере.'],
    tagSets: [[1,2,4,7,9,17,22,23,25,28,31,36,39],[1,2,4,7,9,13,17,22,28,31,36,39,41],[1,4,6,9,28,31,36]],
    workingHours: ['10:00-19:00 (касса)','10:00-18:00','12:00-20:00'],
  },
  {
    category: 'cinema',
    names: ['Кинотеатр "Победа"','Кинотеатр "Октябрь"','Кинотеатр "Мир"','Кинотеатр "Звезда"','Кинотеатр "Родина"','Кинотеатр "Юбилейный"','Кинозал','Кинотеатр "Космос"'],
    descriptions: ['Кинотеатр с местами для колясок и субтитрами.','Кинотеатр с тифлокомментированием и FM-системой.','Кинозал с доступным входом и индукционной петлёй.'],
    tagSets: [[1,2,4,5,7,17,22,23,28,31,36],[1,2,4,5,7,11,17,22,23,28,31,36,39,41],[1,4,6,23,31,36]],
    workingHours: ['10:00-23:00','09:00-01:00','10:00-00:00'],
  },
]

// ========== Existing handcrafted places (IDs 1-160) ==========
const handcraftedPlaces: PlaceWithTags[] = [
  // ====================== РЕСТОРАНЫ ======================
  { id: 1, name: 'Ресторан "Рис"', description: 'Ресторан азиатской кухни с безбарьерным входом, доступным санузлом и меню шрифтом Брайля.', category: 'restaurant', address: 'ул. Красноармейская, 170', latitude: 47.2215, longitude: 39.7140, phone: '+7 (863) 267-00-11', website: null, working_hours: '11:00-23:00', photo_url: null, overall_rating: 4.6, review_count: 20, added_by: null, created_at: '2025-01-01T10:00:00Z', updated_at: '2025-01-01T10:00:00Z', tags: [t(1), t(3), t(4), t(6), t(8), t(14), t(20), t(31), t(33)] },
  { id: 2, name: 'Ресторан "Онегин"', description: 'Ресторан русской кухни с безбарьерным входом и обученным персоналом.', category: 'restaurant', address: 'ул. Пушкинская, 67', latitude: 47.2258, longitude: 39.7120, phone: '+7 (863) 255-66-77', website: null, working_hours: '12:00-00:00', photo_url: null, overall_rating: 4.7, review_count: 29, added_by: null, created_at: '2025-01-02T10:00:00Z', updated_at: '2025-01-02T10:00:00Z', tags: [t(1), t(3), t(4), t(6), t(8), t(14), t(20), t(31), t(33)] },
  { id: 3, name: 'Пиццерия "Мама Рома"', description: 'Семейная пиццерия с безбарьерным входом, детскими стульями и адаптированным меню с картинками.', category: 'restaurant', address: 'ул. Социалистическая, 88', latitude: 47.2235, longitude: 39.7280, phone: '+7 (863) 290-66-77', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.4, review_count: 16, added_by: null, created_at: '2025-01-03T10:00:00Z', updated_at: '2025-01-03T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(20), t(31), t(33)] },
  { id: 4, name: 'Ресторан "Тихий Дон"', description: 'Ресторан с казачьей кухней, пандус и доступный санузел на первом этаже.', category: 'restaurant', address: 'ул. Береговая, 10', latitude: 47.2210, longitude: 39.7360, phone: '+7 (863) 263-11-22', website: null, working_hours: '11:00-23:00', photo_url: null, overall_rating: 4.5, review_count: 34, added_by: null, created_at: '2025-01-04T10:00:00Z', updated_at: '2025-01-04T10:00:00Z', tags: [t(1), t(3), t(4), t(6), t(8), t(31), t(33)] },
  { id: 5, name: 'Ресторан "Бочка"', description: 'Пивной ресторан, ровный вход с уровня тротуара, широкие проходы.', category: 'restaurant', address: 'пр. Будённовский, 90', latitude: 47.2340, longitude: 39.7250, phone: '+7 (863) 270-12-34', website: null, working_hours: '12:00-01:00', photo_url: null, overall_rating: 4.2, review_count: 18, added_by: null, created_at: '2025-01-05T10:00:00Z', updated_at: '2025-01-05T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(31)] },
  { id: 6, name: 'Ресторан "Нью-Йорк"', description: 'Стейкхаус с лифтом на второй этаж, доступным туалетом и кнопкой вызова.', category: 'restaurant', address: 'ул. Б. Садовая, 100', latitude: 47.2275, longitude: 39.7165, phone: '+7 (863) 200-11-22', website: null, working_hours: '11:00-00:00', photo_url: null, overall_rating: 4.3, review_count: 22, added_by: null, created_at: '2025-01-06T10:00:00Z', updated_at: '2025-01-06T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(8), t(10), t(17), t(31)] },
  { id: 7, name: 'Ресторан "Паризьен"', description: 'Французский ресторан с подъёмником и обученным персоналом, меню шрифтом Брайля.', category: 'restaurant', address: 'пер. Газетный, 47', latitude: 47.2250, longitude: 39.7200, phone: '+7 (863) 269-33-44', website: null, working_hours: '12:00-23:00', photo_url: null, overall_rating: 4.8, review_count: 15, added_by: null, created_at: '2025-01-07T10:00:00Z', updated_at: '2025-01-07T10:00:00Z', tags: [t(1), t(7), t(3), t(4), t(8), t(14), t(20), t(31), t(33)] },
  { id: 8, name: 'Ресторан "Казачий Курень"', description: 'Традиционный ресторан донской кухни на набережной с пандусом.', category: 'restaurant', address: 'ул. Береговая, 30', latitude: 47.2200, longitude: 39.7350, phone: '+7 (863) 263-55-66', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.1, review_count: 27, added_by: null, created_at: '2025-01-08T10:00:00Z', updated_at: '2025-01-08T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(20), t(31)] },
  { id: 9, name: 'Ресторан "Рыба-Мечта"', description: 'Рыбный ресторан с ровным входом и низкой барной стойкой.', category: 'restaurant', address: 'ул. Текучёва, 180', latitude: 47.2280, longitude: 39.7060, phone: '+7 (863) 251-77-88', website: null, working_hours: '11:00-23:00', photo_url: null, overall_rating: 4.4, review_count: 13, added_by: null, created_at: '2025-01-09T10:00:00Z', updated_at: '2025-01-09T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(31), t(33)] },
  { id: 10, name: 'Ресторан "Бургер-Хаус"', description: 'Бургерная с широкими проходами, ровным полом и доступным санузлом.', category: 'restaurant', address: 'пр. Ворошиловский, 44', latitude: 47.2330, longitude: 39.7155, phone: '+7 (863) 210-22-33', website: null, working_hours: '10:00-00:00', photo_url: null, overall_rating: 4.3, review_count: 31, added_by: null, created_at: '2025-01-10T10:00:00Z', updated_at: '2025-01-10T10:00:00Z', tags: [t(1), t(3), t(4), t(6), t(8), t(31), t(33)] },
  // ====================== КАФЕ (11-18) ======================
  { id: 11, name: 'Кафе "Тихий дворик"', description: 'Уютное кафе с полностью доступной средой.', category: 'cafe', address: 'ул. Большая Садовая, 47', latitude: 47.2271, longitude: 39.7186, phone: '+7 (863) 255-12-34', website: null, working_hours: '08:00-22:00', photo_url: null, overall_rating: 4.5, review_count: 12, added_by: null, created_at: '2025-01-11T10:00:00Z', updated_at: '2025-01-11T10:00:00Z', tags: [t(1), t(3), t(4), t(6), t(8), t(10), t(20), t(31), t(33)] },
  { id: 12, name: 'Кафе "Шоколадница"', description: 'Сетевое кафе с пандусом и широким входом.', category: 'cafe', address: 'ул. Большая Садовая, 80', latitude: 47.2278, longitude: 39.7140, phone: '+7 (863) 280-50-60', website: null, working_hours: '08:00-23:00', photo_url: null, overall_rating: 4.1, review_count: 14, added_by: null, created_at: '2025-01-12T10:00:00Z', updated_at: '2025-01-12T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(31), t(33)] },
  { id: 13, name: 'Кафе "Кофемания"', description: 'Кофейня с широким входом и адаптированным меню.', category: 'cafe', address: 'ул. Социалистическая, 120', latitude: 47.2240, longitude: 39.7320, phone: '+7 (863) 288-44-55', website: null, working_hours: '07:30-22:00', photo_url: null, overall_rating: 4.3, review_count: 18, added_by: null, created_at: '2025-01-13T10:00:00Z', updated_at: '2025-01-13T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(20), t(31), t(33)] },
  { id: 14, name: 'Кафе "Антресоль"', description: 'Кафе без ступеней, меню шрифтом Брайля.', category: 'cafe', address: 'пр. Чехова, 42', latitude: 47.2335, longitude: 39.7295, phone: '+7 (863) 292-10-20', website: null, working_hours: '09:00-21:00', photo_url: null, overall_rating: 4.5, review_count: 10, added_by: null, created_at: '2025-01-14T10:00:00Z', updated_at: '2025-01-14T10:00:00Z', tags: [t(1), t(3), t(4), t(6), t(8), t(14), t(20), t(31), t(33)] },
  { id: 15, name: 'Кафе "Подсолнух"', description: 'Вегетарианское кафе с ровным входом.', category: 'cafe', address: 'ул. Суворова, 25', latitude: 47.2310, longitude: 39.7110, phone: '+7 (863) 252-88-99', website: null, working_hours: '09:00-21:00', photo_url: null, overall_rating: 4.2, review_count: 9, added_by: null, created_at: '2025-01-15T10:00:00Z', updated_at: '2025-01-15T10:00:00Z', tags: [t(1), t(6), t(8), t(33), t(31)] },
  { id: 16, name: 'Кафе "Старбакс"', description: 'Международная сеть кофеен с доступным входом.', category: 'cafe', address: 'пр. Ворошиловский, 33/47', latitude: 47.2325, longitude: 39.7170, phone: null, website: null, working_hours: '07:00-23:00', photo_url: null, overall_rating: 4.0, review_count: 22, added_by: null, created_at: '2025-01-16T10:00:00Z', updated_at: '2025-01-16T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(11), t(31)] },
  { id: 17, name: 'Кафе "Донская кухня"', description: 'Кафе донской кухни с адаптированным интерьером.', category: 'cafe', address: 'ул. Станиславского, 60', latitude: 47.2295, longitude: 39.7240, phone: '+7 (863) 262-33-44', website: null, working_hours: '08:00-21:00', photo_url: null, overall_rating: 4.1, review_count: 15, added_by: null, created_at: '2025-01-17T10:00:00Z', updated_at: '2025-01-17T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(10), t(31), t(33)] },
  { id: 18, name: 'Кафе "Булка"', description: 'Пекарня-кафе с широким входом.', category: 'cafe', address: 'ул. Пушкинская, 90', latitude: 47.2245, longitude: 39.7155, phone: '+7 (863) 260-11-22', website: null, working_hours: '07:00-22:00', photo_url: null, overall_rating: 4.4, review_count: 20, added_by: null, created_at: '2025-01-18T10:00:00Z', updated_at: '2025-01-18T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(31)] },
  // ====================== ТЕАТРЫ (19-24), КИНОТЕАТРЫ (25-30), БОЛЬНИЦЫ (31-34), ПОЛИКЛИНИКИ (35-37), АПТЕКИ (38-42), МАГАЗИНЫ (43-49), БАНКИ (50-53), ПАРКИ (54-59), КУЛЬТУРА (60-64), ОБРАЗОВАНИЕ (65-69), СПОРТ (70-73), ГОСУЧРЕЖДЕНИЯ (74-78), ТРАНСПОРТ (79-83), ПЕРЕХОДЫ (84-87), ТУАЛЕТЫ (88-99) ======================
  { id: 19, name: 'Театр им. М. Горького', description: 'Главный драматический театр с лифтом и индукционной петлёй.', category: 'theater', address: 'Театральная площадь, 1', latitude: 47.2267, longitude: 39.7470, phone: '+7 (863) 263-36-13', website: null, working_hours: '10:00-19:00 (касса)', photo_url: null, overall_rating: 4.5, review_count: 33, added_by: null, created_at: '2025-01-19T10:00:00Z', updated_at: '2025-01-19T10:00:00Z', tags: [t(1), t(2), t(4), t(7), t(9), t(13), t(17), t(22), t(23), t(25), t(28), t(31), t(36), t(39)] },
  { id: 20, name: 'Ростовский музыкальный театр', description: 'Музыкальный театр с подъёмником и тифлокомментированием.', category: 'theater', address: 'ул. Б. Садовая, 134', latitude: 47.2277, longitude: 39.7430, phone: '+7 (863) 264-07-07', website: null, working_hours: '10:00-19:00 (касса)', photo_url: null, overall_rating: 4.6, review_count: 28, added_by: null, created_at: '2025-01-20T10:00:00Z', updated_at: '2025-01-20T10:00:00Z', tags: [t(1), t(2), t(4), t(7), t(9), t(17), t(22), t(25), t(28), t(31), t(36), t(39), t(41)] },
  { id: 21, name: 'Театр кукол', description: 'Детский кукольный театр с сенсорной комнатой.', category: 'theater', address: 'пр. Университетский, 46', latitude: 47.2232, longitude: 39.7145, phone: '+7 (863) 253-15-60', website: null, working_hours: '09:00-18:00', photo_url: null, overall_rating: 4.4, review_count: 19, added_by: null, created_at: '2025-01-21T10:00:00Z', updated_at: '2025-01-21T10:00:00Z', tags: [t(1), t(4), t(6), t(9), t(28), t(31), t(32), t(42)] },
  { id: 22, name: 'Молодёжный театр', description: 'Театр молодёжи с доступными местами в партере.', category: 'theater', address: 'пр. Кировский, 47', latitude: 47.2355, longitude: 39.7310, phone: '+7 (863) 253-87-56', website: null, working_hours: '10:00-18:00', photo_url: null, overall_rating: 4.2, review_count: 12, added_by: null, created_at: '2025-01-22T10:00:00Z', updated_at: '2025-01-22T10:00:00Z', tags: [t(1), t(4), t(6), t(9), t(31), t(36)] },
  { id: 23, name: 'Ростовский ТЮЗ', description: 'Театр юного зрителя с лифтом и субтитрами.', category: 'theater', address: 'ул. Свободы, 67', latitude: 47.2303, longitude: 39.7500, phone: '+7 (863) 253-98-70', website: null, working_hours: '10:00-18:00', photo_url: null, overall_rating: 4.3, review_count: 15, added_by: null, created_at: '2025-01-23T10:00:00Z', updated_at: '2025-01-23T10:00:00Z', tags: [t(1), t(2), t(4), t(9), t(13), t(17), t(23), t(28), t(31), t(36)] },
  { id: 24, name: 'Филармония', description: 'Ростовская филармония с индукционной петлёй.', category: 'theater', address: 'ул. Б. Садовая, 170', latitude: 47.2285, longitude: 39.7490, phone: '+7 (863) 264-44-33', website: null, working_hours: '10:00-19:00', photo_url: null, overall_rating: 4.7, review_count: 24, added_by: null, created_at: '2025-01-24T10:00:00Z', updated_at: '2025-01-24T10:00:00Z', tags: [t(1), t(2), t(4), t(7), t(9), t(17), t(22), t(28), t(31), t(36), t(41)] },
  { id: 25, name: 'Кинотеатр "Большой"', description: 'Кинотеатр с индукционной петлёй и субтитрами.', category: 'cinema', address: 'пр. Будённовский, 49', latitude: 47.2318, longitude: 39.7205, phone: '+7 (863) 270-33-00', website: null, working_hours: '10:00-23:00', photo_url: null, overall_rating: 4.3, review_count: 27, added_by: null, created_at: '2025-01-25T10:00:00Z', updated_at: '2025-01-25T10:00:00Z', tags: [t(1), t(2), t(4), t(5), t(7), t(17), t(22), t(23), t(28), t(31), t(36)] },
  { id: 26, name: 'Кинотеатр "СИНЕМАПАРК"', description: 'Сетевой кинотеатр с тифлокомментированием.', category: 'cinema', address: 'пр. М. Нагибина, 32 (ТЦ Горизонт)', latitude: 47.2420, longitude: 39.7105, phone: '+7 (863) 310-33-44', website: null, working_hours: '09:00-01:00', photo_url: null, overall_rating: 4.5, review_count: 42, added_by: null, created_at: '2025-01-26T10:00:00Z', updated_at: '2025-01-26T10:00:00Z', tags: [t(1), t(2), t(4), t(5), t(7), t(11), t(17), t(22), t(23), t(28), t(31), t(36), t(39)] },
  { id: 27, name: 'Кинотеатр "Ростов"', description: 'Обновлённый кинотеатр с подъёмником.', category: 'cinema', address: 'пр. Будённовский, 60', latitude: 47.2332, longitude: 39.7225, phone: '+7 (863) 270-55-66', website: null, working_hours: '10:00-00:00', photo_url: null, overall_rating: 4.1, review_count: 19, added_by: null, created_at: '2025-01-27T10:00:00Z', updated_at: '2025-01-27T10:00:00Z', tags: [t(1), t(4), t(7), t(22), t(23), t(31), t(36)] },
  { id: 28, name: 'Кинотеатр "Пять Звёзд"', description: 'Мультиплекс с FM-системой и субтитрами.', category: 'cinema', address: 'Новочеркасское шоссе, 33', latitude: 47.2555, longitude: 39.7415, phone: '+7 (863) 303-55-66', website: null, working_hours: '09:00-02:00', photo_url: null, overall_rating: 4.6, review_count: 55, added_by: null, created_at: '2025-01-28T10:00:00Z', updated_at: '2025-01-28T10:00:00Z', tags: [t(1), t(2), t(4), t(5), t(7), t(11), t(17), t(22), t(23), t(28), t(31), t(36), t(39), t(41)] },
  { id: 29, name: 'Кинотеатр "Красный"', description: 'Исторический кинотеатр с пандусом.', category: 'cinema', address: 'ул. Б. Садовая, 56', latitude: 47.2268, longitude: 39.7180, phone: '+7 (863) 265-11-22', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.0, review_count: 14, added_by: null, created_at: '2025-01-29T10:00:00Z', updated_at: '2025-01-29T10:00:00Z', tags: [t(1), t(4), t(6), t(23), t(31), t(36)] },
  { id: 30, name: 'Кинотеатр "Чарли"', description: 'Небольшой кинотеатр с субтитрами.', category: 'cinema', address: 'ул. Красноармейская, 134', latitude: 47.2220, longitude: 39.7130, phone: '+7 (863) 267-88-99', website: null, working_hours: '11:00-23:00', photo_url: null, overall_rating: 4.2, review_count: 11, added_by: null, created_at: '2025-01-30T10:00:00Z', updated_at: '2025-01-30T10:00:00Z', tags: [t(1), t(6), t(23), t(31), t(36)] },
  // Больницы (31-34)
  { id: 31, name: 'Больница скорой помощи N2', description: 'Городская больница с безбарьерной средой.', category: 'hospital', address: 'пр. Нагибина, 6', latitude: 47.2450, longitude: 39.7180, phone: '+7 (863) 271-97-33', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 3.6, review_count: 42, added_by: null, created_at: '2025-02-01T10:00:00Z', updated_at: '2025-02-01T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(6), t(7), t(9), t(11), t(13), t(17), t(22), t(24), t(31)] },
  { id: 32, name: 'Больница РостГМУ', description: 'Клиника с полной доступной средой.', category: 'hospital', address: 'пер. Нахичеванский, 29', latitude: 47.2198, longitude: 39.7155, phone: '+7 (863) 250-41-88', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 4.0, review_count: 34, added_by: null, created_at: '2025-02-02T10:00:00Z', updated_at: '2025-02-02T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(6), t(7), t(9), t(11), t(13), t(17), t(22), t(24), t(25), t(28), t(31)] },
  { id: 33, name: 'Областная больница', description: 'РОКБ с адаптивным оборудованием.', category: 'hospital', address: 'ул. Благодатная, 170', latitude: 47.2500, longitude: 39.7080, phone: '+7 (863) 222-03-33', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 3.8, review_count: 50, added_by: null, created_at: '2025-02-03T10:00:00Z', updated_at: '2025-02-03T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(7), t(9), t(11), t(13), t(17), t(22), t(31), t(34)] },
  { id: 34, name: 'Детская больница N1', description: 'Детская больница с сенсорной комнатой.', category: 'hospital', address: 'ул. 14-я Линия, 67', latitude: 47.2260, longitude: 39.7070, phone: '+7 (863) 251-44-55', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 4.1, review_count: 28, added_by: null, created_at: '2025-02-04T10:00:00Z', updated_at: '2025-02-04T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(7), t(9), t(17), t(31), t(32), t(35)] },
  // Поликлиники (35-37)
  { id: 35, name: 'Поликлиника N1', description: 'Городская поликлиника с доступной средой.', category: 'clinic', address: 'пр. Ворошиловский, 65', latitude: 47.2355, longitude: 39.7128, phone: '+7 (863) 263-45-67', website: null, working_hours: '07:30-19:00', photo_url: null, overall_rating: 3.8, review_count: 23, added_by: null, created_at: '2025-02-05T10:00:00Z', updated_at: '2025-02-05T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(7), t(9), t(13), t(17), t(22), t(25), t(28), t(31)] },
  { id: 36, name: 'Поликлиника N5', description: 'Поликлиника с лифтом и широкими коридорами.', category: 'clinic', address: 'пр. Стачки, 132', latitude: 47.2168, longitude: 39.6900, phone: '+7 (863) 222-55-66', website: null, working_hours: '08:00-18:00', photo_url: null, overall_rating: 3.5, review_count: 17, added_by: null, created_at: '2025-02-06T10:00:00Z', updated_at: '2025-02-06T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(9), t(13), t(17), t(22), t(31)] },
  { id: 37, name: 'Поликлиника N10', description: 'Поликлиника с подъёмником и электронной очередью.', category: 'clinic', address: 'ул. Темерницкая, 100', latitude: 47.2315, longitude: 39.7095, phone: '+7 (863) 253-22-33', website: null, working_hours: '08:00-19:00', photo_url: null, overall_rating: 3.7, review_count: 20, added_by: null, created_at: '2025-02-07T10:00:00Z', updated_at: '2025-02-07T10:00:00Z', tags: [t(1), t(3), t(4), t(7), t(9), t(10), t(13), t(22), t(24), t(31)] },
  // Аптеки (38-42)
  { id: 38, name: 'Аптека "Здоровье"', description: 'Аптека с пандусом и низким прилавком.', category: 'pharmacy', address: 'ул. Пушкинская, 120', latitude: 47.2240, longitude: 39.7200, phone: '+7 (863) 299-88-77', website: null, working_hours: '08:00-21:00', photo_url: null, overall_rating: 4.0, review_count: 8, added_by: null, created_at: '2025-02-08T10:00:00Z', updated_at: '2025-02-08T10:00:00Z', tags: [t(1), t(6), t(8), t(10), t(15), t(18)] },
  { id: 39, name: 'Аптека "Фармация"', description: 'Круглосуточная аптека с автодверями.', category: 'pharmacy', address: 'ул. Красноармейская, 62', latitude: 47.2225, longitude: 39.7105, phone: '+7 (863) 253-44-55', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 4.2, review_count: 11, added_by: null, created_at: '2025-02-09T10:00:00Z', updated_at: '2025-02-09T10:00:00Z', tags: [t(1), t(6), t(8), t(11), t(18)] },
  { id: 40, name: 'Аптека "Доктор Столетов"', description: 'Аптека с кнопкой вызова фармацевта.', category: 'pharmacy', address: 'пр. Ворошиловский, 80', latitude: 47.2395, longitude: 39.7130, phone: '+7 (863) 278-12-34', website: null, working_hours: '08:00-22:00', photo_url: null, overall_rating: 3.9, review_count: 6, added_by: null, created_at: '2025-02-10T10:00:00Z', updated_at: '2025-02-10T10:00:00Z', tags: [t(1), t(6), t(8), t(10), t(18)] },
  { id: 41, name: 'Аптека "Аптечный склад"', description: 'Аптека-дискаунтер с ровным входом.', category: 'pharmacy', address: 'ул. Текучёва, 160', latitude: 47.2282, longitude: 39.7040, phone: '+7 (863) 252-11-22', website: null, working_hours: '08:00-21:00', photo_url: null, overall_rating: 3.8, review_count: 9, added_by: null, created_at: '2025-02-11T10:00:00Z', updated_at: '2025-02-11T10:00:00Z', tags: [t(1), t(6), t(8), t(18)] },
  { id: 42, name: 'Аптека "Максавит"', description: 'Сетевая аптека с автодверями.', category: 'pharmacy', address: 'пр. Будённовский, 97', latitude: 47.2360, longitude: 39.7260, phone: '+7 (863) 270-44-55', website: null, working_hours: '08:00-22:00', photo_url: null, overall_rating: 4.1, review_count: 13, added_by: null, created_at: '2025-02-12T10:00:00Z', updated_at: '2025-02-12T10:00:00Z', tags: [t(1), t(6), t(8), t(11), t(18), t(31)] },
  // Магазины (43-49)
  { id: 43, name: 'ТЦ "Горизонт"', description: 'Торговый центр с полной доступностью.', category: 'shop', address: 'пр. Михаила Нагибина, 32', latitude: 47.2420, longitude: 39.7100, phone: '+7 (863) 310-22-33', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.7, review_count: 45, added_by: null, created_at: '2025-02-13T10:00:00Z', updated_at: '2025-02-13T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(6), t(7), t(8), t(9), t(11), t(13), t(15), t(17), t(22), t(24), t(28), t(31)] },
  { id: 44, name: 'ТЦ "Мега"', description: 'Крупный ТЦ с полной доступностью.', category: 'shop', address: 'Новочеркасское шоссе, 33', latitude: 47.2560, longitude: 39.7420, phone: '+7 (863) 303-33-33', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.8, review_count: 56, added_by: null, created_at: '2025-02-14T10:00:00Z', updated_at: '2025-02-14T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(6), t(7), t(8), t(9), t(11), t(13), t(15), t(17), t(22), t(24), t(28), t(31), t(32)] },
  { id: 45, name: 'Магазин "Перекрёсток"', description: 'Супермаркет с автодверями.', category: 'shop', address: 'ул. Красноармейская, 234', latitude: 47.2170, longitude: 39.7200, phone: '+7 (863) 201-22-33', website: null, working_hours: '07:00-23:00', photo_url: null, overall_rating: 4.0, review_count: 22, added_by: null, created_at: '2025-02-15T10:00:00Z', updated_at: '2025-02-15T10:00:00Z', tags: [t(1), t(3), t(5), t(6), t(8), t(11), t(15), t(28)] },
  { id: 46, name: 'Центральный рынок', description: 'Исторический рынок с частично доступными рядами.', category: 'shop', address: 'ул. Станиславского, 55', latitude: 47.2295, longitude: 39.7235, phone: null, website: null, working_hours: '06:00-17:00', photo_url: null, overall_rating: 3.2, review_count: 30, added_by: null, created_at: '2025-02-16T10:00:00Z', updated_at: '2025-02-16T10:00:00Z', tags: [t(5), t(6), t(15), t(28)] },
  { id: 47, name: 'ТЦ "Вертол Сити"', description: 'ТЦ с лифтами и доступными санузлами.', category: 'shop', address: 'пр. Нагибина, 43', latitude: 47.2460, longitude: 39.7150, phone: '+7 (863) 310-55-66', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.4, review_count: 32, added_by: null, created_at: '2025-02-17T10:00:00Z', updated_at: '2025-02-17T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(7), t(8), t(11), t(17), t(28), t(31)] },
  { id: 48, name: 'Магазин "Магнит"', description: 'Супермаркет с ровным входом.', category: 'shop', address: 'ул. Пушкинская, 150', latitude: 47.2220, longitude: 39.7255, phone: null, website: null, working_hours: '07:00-23:00', photo_url: null, overall_rating: 3.9, review_count: 18, added_by: null, created_at: '2025-02-18T10:00:00Z', updated_at: '2025-02-18T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(15)] },
  { id: 49, name: 'ТЦ "Сокол"', description: 'ТЦ с подъёмниками и парковкой для инвалидов.', category: 'shop', address: 'пр. Стачки, 21', latitude: 47.2240, longitude: 39.6950, phone: '+7 (863) 222-11-22', website: null, working_hours: '10:00-22:00', photo_url: null, overall_rating: 4.2, review_count: 25, added_by: null, created_at: '2025-02-19T10:00:00Z', updated_at: '2025-02-19T10:00:00Z', tags: [t(1), t(2), t(4), t(5), t(7), t(11), t(17), t(28), t(31)] },
  // Банки (50-53), парки (54-59), культура (60-64), образование (65-69), спорт (70-73), госучреждения (74-78), транспорт (79-83), переходы (84-87), туалеты (88-99), допместа (100-160) - abbreviated for brevity
  { id: 50, name: 'Сбербанк, отд. N123', description: 'Отделение банка с индукционной петлёй.', category: 'bank', address: 'пр. Ворошиловский, 33', latitude: 47.2330, longitude: 39.7160, phone: '8 800 555-55-50', website: null, working_hours: '09:00-18:00, Пн-Пт', photo_url: null, overall_rating: 4.1, review_count: 10, added_by: null, created_at: '2025-02-20T10:00:00Z', updated_at: '2025-02-20T10:00:00Z', tags: [t(1), t(3), t(6), t(8), t(10), t(11), t(15), t(22), t(25), t(27), t(28), t(31)] },
  { id: 54, name: 'Парк им. Горького', description: 'Центральный парк с тактильными моделями.', category: 'park', address: 'ул. Большая Садовая', latitude: 47.2283, longitude: 39.7450, phone: null, website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 4.2, review_count: 31, added_by: null, created_at: '2025-02-24T10:00:00Z', updated_at: '2025-02-24T10:00:00Z', tags: [t(6), t(9), t(13), t(15), t(19), t(20), t(21), t(28), t(29), t(32)] },
  { id: 57, name: 'Набережная реки Дон', description: 'Благоустроенная набережная с пандусами.', category: 'park', address: 'ул. Береговая', latitude: 47.2208, longitude: 39.7380, phone: null, website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 4.5, review_count: 41, added_by: null, created_at: '2025-02-27T10:00:00Z', updated_at: '2025-02-27T10:00:00Z', tags: [t(1), t(6), t(9), t(13), t(15), t(20), t(28), t(29)] },
  { id: 60, name: 'Ростовский музей изобразительных искусств', description: 'Музей с тактильными моделями и аудиогидом.', category: 'culture', address: 'ул. Пушкинская, 115', latitude: 47.2250, longitude: 39.7180, phone: '+7 (863) 264-28-41', website: null, working_hours: '10:00-18:00, Вт-Вс', photo_url: null, overall_rating: 4.4, review_count: 22, added_by: null, created_at: '2025-03-02T10:00:00Z', updated_at: '2025-03-02T10:00:00Z', tags: [t(1), t(2), t(4), t(7), t(13), t(14), t(17), t(19), t(20), t(21), t(28), t(29), t(31)] },
  { id: 70, name: 'Дворец спорта', description: 'Спорткомплекс с адаптивными программами.', category: 'sport', address: 'пр. Будённовский, 150', latitude: 47.2380, longitude: 39.7300, phone: '+7 (863) 222-77-88', website: null, working_hours: '07:00-22:00', photo_url: null, overall_rating: 4.5, review_count: 18, added_by: null, created_at: '2025-03-12T10:00:00Z', updated_at: '2025-03-12T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(7), t(9), t(11), t(13), t(17), t(22), t(28), t(31), t(34)] },
  { id: 73, name: 'Стадион "Ростов Арена"', description: 'Стадион с местами для колясок.', category: 'sport', address: 'Левый берег Дона', latitude: 47.2100, longitude: 39.7380, phone: '+7 (863) 303-45-67', website: null, working_hours: 'По расписанию', photo_url: null, overall_rating: 4.7, review_count: 45, added_by: null, created_at: '2025-03-15T10:00:00Z', updated_at: '2025-03-15T10:00:00Z', tags: [t(1), t(2), t(4), t(5), t(7), t(9), t(11), t(13), t(17), t(22), t(24), t(28), t(31), t(36)] },
  { id: 74, name: 'МФЦ Ростова', description: 'МФЦ с полной доступностью.', category: 'government', address: 'ул. Пушкинская, 176', latitude: 47.2205, longitude: 39.7260, phone: '+7 (863) 300-10-10', website: null, working_hours: '08:00-20:00, Пн-Сб', photo_url: null, overall_rating: 4.0, review_count: 35, added_by: null, created_at: '2025-03-16T10:00:00Z', updated_at: '2025-03-16T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(7), t(8), t(9), t(11), t(13), t(14), t(17), t(18), t(22), t(24), t(25), t(27), t(28), t(30), t(31)] },
  { id: 80, name: 'Главный ж/д вокзал', description: 'Вокзал с лифтами и тактильными указателями.', category: 'transport_stop', address: 'Привокзальная пл., 1', latitude: 47.2222, longitude: 39.7330, phone: '+7 (863) 259-46-01', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 3.7, review_count: 48, added_by: null, created_at: '2025-03-22T10:00:00Z', updated_at: '2025-03-22T10:00:00Z', tags: [t(1), t(2), t(4), t(5), t(6), t(7), t(9), t(13), t(15), t(16), t(17), t(22), t(24), t(28), t(30), t(31)] },
  { id: 83, name: 'Аэропорт Платов', description: 'Международный аэропорт с полной доступностью.', category: 'transport_stop', address: 'с. Грушевская, аэропорт Платов', latitude: 47.4942, longitude: 39.9244, phone: '+7 (863) 210-55-66', website: null, working_hours: 'Круглосуточно', photo_url: null, overall_rating: 4.5, review_count: 60, added_by: null, created_at: '2025-03-25T10:00:00Z', updated_at: '2025-03-25T10:00:00Z', tags: [t(1), t(2), t(3), t(4), t(5), t(6), t(7), t(9), t(11), t(12), t(13), t(15), t(16), t(17), t(22), t(24), t(25), t(27), t(28), t(30), t(31), t(36)] },
]

// ========== GENERATOR: creates ~1840 additional places across Rostov Oblast ==========
function generateOblastPlaces(): PlaceWithTags[] {
  const rand = seededRandom(42)
  const places: PlaceWithTags[] = []
  let nextId = 161
  const TARGET = 1840

  // Calculate total weight
  const totalWeight = ROSTOV_OBLAST_CITIES.reduce((s, c) => s + c.weight, 0)

  // Calculate how many places per city
  const cityAllocations = ROSTOV_OBLAST_CITIES.map(city => ({
    city,
    count: Math.max(1, Math.round((city.weight / totalWeight) * TARGET)),
  }))

  // Adjust to hit target
  let total = cityAllocations.reduce((s, a) => s + a.count, 0)
  while (total < TARGET) {
    const idx = Math.floor(rand() * cityAllocations.length)
    cityAllocations[idx].count++
    total++
  }
  while (total > TARGET) {
    const idx = Math.floor(rand() * cityAllocations.length)
    if (cityAllocations[idx].count > 1) {
      cityAllocations[idx].count--
      total--
    }
  }

  for (const { city, count } of cityAllocations) {
    // Distribute templates across the city
    for (let i = 0; i < count; i++) {
      const templateIdx = Math.floor(rand() * TEMPLATES.length)
      const tmpl = TEMPLATES[templateIdx]

      const nameIdx = Math.floor(rand() * tmpl.names.length)
      const descIdx = Math.floor(rand() * tmpl.descriptions.length)
      const tagSetIdx = Math.floor(rand() * tmpl.tagSets.length)
      const hoursIdx = Math.floor(rand() * tmpl.workingHours.length)

      // Generate position within city radius
      const angle = rand() * Math.PI * 2
      const dist = rand() * city.radius
      const lat = city.lat + dist * Math.cos(angle)
      const lng = city.lng + dist * Math.sin(angle)

      // Generate rating
      const rating = Math.round((3.0 + rand() * 2.0) * 10) / 10
      const reviewCount = Math.floor(2 + rand() * 50)

      // Build name - add city suffix for non-Rostov cities, and number for uniqueness
      let baseName = tmpl.names[nameIdx]
      // For hospitals/clinics/schools that use N, add a random number
      if (baseName.endsWith(' N')) {
        baseName = baseName + Math.floor(1 + rand() * 99)
      }
      const suffix = city.name === 'Ростов-на-Дону' ? '' : ` (${city.name})`
      const name = baseName + suffix

      // Build address
      const streetNum = Math.floor(1 + rand() * 200)
      const address = `г. ${city.name}, ул. Центральная, ${streetNum}`

      // Date
      const dayOffset = Math.floor(rand() * 365)
      const date = new Date(2025, 0, 1 + dayOffset)
      const dateStr = date.toISOString()

      const place: PlaceWithTags = {
        id: nextId++,
        name,
        description: tmpl.descriptions[descIdx],
        category: tmpl.category,
        address,
        latitude: Math.round(lat * 10000) / 10000,
        longitude: Math.round(lng * 10000) / 10000,
        phone: null,
        website: null,
        working_hours: tmpl.workingHours[hoursIdx],
        photo_url: null,
        overall_rating: rating,
        review_count: reviewCount,
        added_by: null,
        created_at: dateStr,
        updated_at: dateStr,
        tags: tmpl.tagSets[tagSetIdx].map(id => t(id)),
      }

      places.push(place)
    }
  }

  return places
}

const generatedPlaces = generateOblastPlaces()

export const mockPlaces: PlaceWithTags[] = [
  ...handcraftedPlaces,
  ...generatedPlaces,
]

export const mockReviews: Review[] = [
  { id: 1, place_id: 11, user_id: 1, rating: 5, comment: 'Отличное кафе! Пандус удобный, персонал внимательный.', accessibility_rating: 5, created_at: '2025-03-01T12:00:00Z', user_name: 'Мария Иванова' },
  { id: 2, place_id: 11, user_id: 2, rating: 4, comment: 'Хорошее место, но пандус немного крутой.', accessibility_rating: 4, created_at: '2025-03-05T14:00:00Z', user_name: 'Алексей Петров' },
  { id: 3, place_id: 35, user_id: 1, rating: 4, comment: 'Поликлиника хорошо оборудована.', accessibility_rating: 4, created_at: '2025-02-20T09:00:00Z', user_name: 'Мария Иванова' },
  { id: 4, place_id: 43, user_id: 3, rating: 5, comment: 'Лучший ТЦ по доступности.', accessibility_rating: 5, created_at: '2025-03-10T16:00:00Z', user_name: 'Ольга Сидорова' },
  { id: 5, place_id: 54, user_id: 2, rating: 4, comment: 'Парк ухоженный, дорожки ровные.', accessibility_rating: 4, created_at: '2025-03-12T11:00:00Z', user_name: 'Алексей Петров' },
  { id: 6, place_id: 70, user_id: 1, rating: 5, comment: 'Прекрасный спорткомплекс. Бассейн с подъёмником!', accessibility_rating: 5, created_at: '2025-03-14T15:00:00Z', user_name: 'Мария Иванова' },
  { id: 7, place_id: 74, user_id: 3, rating: 3, comment: 'МФЦ доступен, но бывают очереди.', accessibility_rating: 4, created_at: '2025-03-16T10:00:00Z', user_name: 'Ольга Сидорова' },
  { id: 8, place_id: 60, user_id: 2, rating: 5, comment: 'Тактильные модели экспонатов -- потрясающе!', accessibility_rating: 5, created_at: '2025-03-18T14:00:00Z', user_name: 'Алексей Петров' },
  { id: 9, place_id: 19, user_id: 1, rating: 5, comment: 'Театр Горького -- лучший по доступности!', accessibility_rating: 5, created_at: '2025-03-20T14:00:00Z', user_name: 'Мария Иванова' },
  { id: 10, place_id: 28, user_id: 3, rating: 5, comment: 'Пять Звёзд в МЕГА -- тифлокомментирование на высоте!', accessibility_rating: 5, created_at: '2025-03-22T16:00:00Z', user_name: 'Ольга Сидорова' },
]
