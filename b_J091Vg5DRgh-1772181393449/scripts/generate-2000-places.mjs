import fs from 'fs'
import path from 'path'

// ======================== CITIES & TOWNS OF ROSTOV OBLAST ========================
const CITIES = [
  // Ростов-на-Дону — центр
  { name: 'Ростов-на-Дону', lat: 47.2357, lng: 39.7015, weight: 25, prefix: 'г. Ростов-на-Дону' },
  // Крупные города
  { name: 'Таганрог', lat: 47.2362, lng: 38.8969, weight: 8, prefix: 'г. Таганрог' },
  { name: 'Шахты', lat: 47.7085, lng: 40.2146, weight: 6, prefix: 'г. Шахты' },
  { name: 'Новочеркасск', lat: 47.4221, lng: 40.0939, weight: 6, prefix: 'г. Новочеркасск' },
  { name: 'Волгодонск', lat: 47.5136, lng: 42.1522, weight: 5, prefix: 'г. Волгодонск' },
  { name: 'Батайск', lat: 47.1386, lng: 39.7441, weight: 4, prefix: 'г. Батайск' },
  { name: 'Новошахтинск', lat: 47.7575, lng: 39.9337, weight: 3, prefix: 'г. Новошахтинск' },
  { name: 'Каменск-Шахтинский', lat: 48.3209, lng: 40.2657, weight: 3, prefix: 'г. Каменск-Шахтинский' },
  { name: 'Азов', lat: 47.0932, lng: 39.4209, weight: 3, prefix: 'г. Азов' },
  { name: 'Гуково', lat: 48.0553, lng: 39.9340, weight: 2, prefix: 'г. Гуково' },
  { name: 'Донецк (РО)', lat: 48.3380, lng: 39.9490, weight: 2, prefix: 'г. Донецк' },
  { name: 'Сальск', lat: 46.4745, lng: 41.5415, weight: 2, prefix: 'г. Сальск' },
  { name: 'Миллерово', lat: 48.9241, lng: 40.3946, weight: 2, prefix: 'г. Миллерово' },
  { name: 'Аксай', lat: 47.2683, lng: 39.8669, weight: 3, prefix: 'г. Аксай' },
  { name: 'Белая Калитва', lat: 48.1875, lng: 40.7871, weight: 2, prefix: 'г. Белая Калитва' },
  { name: 'Красный Сулин', lat: 47.8850, lng: 40.0700, weight: 2, prefix: 'г. Красный Сулин' },
  { name: 'Морозовск', lat: 48.3536, lng: 41.8269, weight: 1, prefix: 'г. Морозовск' },
  { name: 'Семикаракорск', lat: 47.5167, lng: 40.8167, weight: 1, prefix: 'г. Семикаракорск' },
  { name: 'Зерноград', lat: 46.8500, lng: 40.3167, weight: 1, prefix: 'г. Зерноград' },
  { name: 'Константиновск', lat: 47.5833, lng: 41.1000, weight: 1, prefix: 'г. Константиновск' },
  { name: 'Цимлянск', lat: 47.6500, lng: 42.1000, weight: 1, prefix: 'г. Цимлянск' },
  { name: 'Пролетарск', lat: 46.7000, lng: 41.7333, weight: 1, prefix: 'г. Пролетарск' },
  { name: 'Зверево', lat: 48.0333, lng: 40.1167, weight: 1, prefix: 'г. Зверево' },
  // Крупные посёлки и станицы
  { name: 'Станица Вёшенская', lat: 49.6295, lng: 41.7264, weight: 1, prefix: 'ст. Вёшенская' },
  { name: 'Станица Каменоломни', lat: 47.6333, lng: 40.3333, weight: 1, prefix: 'пос. Каменоломни' },
  { name: 'Станица Тацинская', lat: 48.2000, lng: 41.4167, weight: 1, prefix: 'ст. Тацинская' },
  { name: 'Станица Обливская', lat: 48.5333, lng: 42.5167, weight: 1, prefix: 'ст. Обливская' },
  { name: 'Станица Егорлыкская', lat: 46.5667, lng: 40.6500, weight: 1, prefix: 'ст. Егорлыкская' },
  { name: 'Станица Багаевская', lat: 47.3167, lng: 40.3500, weight: 1, prefix: 'ст. Багаевская' },
  { name: 'Чалтырь', lat: 47.2667, lng: 39.5500, weight: 1, prefix: 'с. Чалтырь' },
  { name: 'Станица Кагальницкая', lat: 46.7500, lng: 40.1833, weight: 1, prefix: 'ст. Кагальницкая' },
  { name: 'Станица Староминская', lat: 46.5300, lng: 39.4400, weight: 1, prefix: 'ст. Староминская' },
  { name: 'Целина', lat: 46.5500, lng: 41.0500, weight: 1, prefix: 'пос. Целина' },
  { name: 'Станица Боковская', lat: 49.2333, lng: 41.0667, weight: 1, prefix: 'ст. Боковская' },
  { name: 'Матвеев Курган', lat: 47.5667, lng: 38.8333, weight: 1, prefix: 'пос. Матвеев Курган' },
  { name: 'Покровское', lat: 47.5167, lng: 40.4000, weight: 1, prefix: 'с. Покровское' },
  { name: 'Песчанокопское', lat: 46.1900, lng: 41.0800, weight: 1, prefix: 'с. Песчанокопское' },
  { name: 'Орловский', lat: 46.8700, lng: 42.0700, weight: 1, prefix: 'пос. Орловский' },
  { name: 'Ремонтное', lat: 46.5600, lng: 43.6500, weight: 1, prefix: 'с. Ремонтное' },
  { name: 'Заветное', lat: 47.1200, lng: 43.8900, weight: 1, prefix: 'с. Заветное' },
  { name: 'Дубовское', lat: 47.4500, lng: 42.7500, weight: 1, prefix: 'с. Дубовское' },
]

// ======================== STREET TEMPLATES PER CITY SIZE ========================
const STREETS_BIG = [
  'ул. Ленина', 'ул. Мира', 'пр. Победы', 'ул. Советская', 'ул. Кирова',
  'ул. Пушкина', 'ул. Гагарина', 'ул. Октябрьская', 'ул. Комсомольская', 'ул. Чехова',
  'ул. Горького', 'ул. Маяковского', 'ул. Луначарского', 'ул. Карла Маркса', 'ул. Энгельса',
  'ул. Московская', 'ул. Садовая', 'ул. Школьная', 'ул. Первомайская', 'ул. Молодёжная',
  'ул. Заводская', 'ул. Промышленная', 'ул. Театральная', 'ул. Вокзальная', 'ул. Степная',
  'ул. Южная', 'ул. Северная', 'ул. Центральная', 'пр. Строителей', 'ул. Спортивная',
]

const STREETS_SMALL = [
  'ул. Ленина', 'ул. Мира', 'ул. Советская', 'ул. Кирова', 'ул. Пушкина',
  'ул. Центральная', 'ул. Школьная', 'ул. Садовая', 'ул. Молодёжная', 'ул. Октябрьская',
]

// Separate Rostov streets (for the city center places)
const ROSTOV_STREETS = [
  'ул. Большая Садовая', 'ул. Пушкинская', 'пр. Будённовский', 'пр. Ворошиловский',
  'ул. Красноармейская', 'ул. Социалистическая', 'ул. Станиславского', 'ул. Текучёва',
  'ул. Береговая', 'пер. Газетный', 'ул. Суворова', 'пр. Кировский',
  'ул. Малюгиной', 'ул. Темерницкая', 'пр. Стачки', 'ул. 14-я Линия',
  'пр. М. Нагибина', 'пр. Соколова', 'ул. Шаумяна', 'пер. Доломановский',
  'ул. Лермонтовская', 'ул. Серафимовича', 'ул. Турмалиновская', 'ул. Максима Горького',
  'ул. Нансена', 'пр. Космонавтов', 'ул. Доватора', 'ул. Мечникова',
  'ул. Красноармейская', 'ул. Седова', 'ул. Профсоюзная', 'ул. Варфоломеева',
  'ул. Баумана', 'ул. Зоологическая', 'пр. Сельмаш', 'ул. Волкова',
  'ул. Королёва', 'ул. Крупской', 'ул. 339-й Стрелковой дивизии', 'ул. Металлургическая',
]

// ======================== PLACE TEMPLATES ========================
const CATEGORIES = [
  { cat: 'restaurant', names: [
    'Ресторан "{city_adj}"', 'Ресторан "Восток"', 'Ресторан "Атмосфера"', 'Ресторан "Усадьба"',
    'Ресторан "Шашлычный двор"', 'Ресторан "Гурман"', 'Ресторан "У Михалыча"', 'Ресторан "Донской"',
    'Ресторан "Визит"', 'Ресторан "Старый город"', 'Ресторан "Кавказ"', 'Ресторан "Берег"',
    'Ресторан "Оазис"', 'Ресторан "Причал"', 'Ресторан "Степной"', 'Ресторан "Нива"',
  ], desc: 'Ресторан с {access} для посетителей с ограниченными возможностями.', hours: '11:00-23:00' },
  { cat: 'cafe', names: [
    'Кафе "Уют"', 'Кафе "Ромашка"', 'Кафе "Встреча"', 'Кафе "Сладкое место"',
    'Кафе "Дружба"', 'Кафе "Калина"', 'Кафе "Радуга"', 'Кафе "Берёзка"',
    'Кафе "Лакомка"', 'Кафе "Весна"', 'Кафе "Огонёк"', 'Кафе "Домашний"',
    'Кафе "Тройка"', 'Кафе "Блинная"', 'Кафе "Самовар"', 'Кафе "Забава"',
  ], desc: 'Кафе с {access} и приветливым персоналом.', hours: '08:00-22:00' },
  { cat: 'hospital', names: [
    'Центральная районная больница', 'Городская больница N{n}', 'Районная больница',
    'Детская больница', 'Больница скорой помощи',
  ], desc: 'Больница с {access} для пациентов с ОВЗ.', hours: 'Круглосуточно' },
  { cat: 'clinic', names: [
    'Городская поликлиника N{n}', 'Районная поликлиника', 'Поликлиника N{n}',
    'Стоматологическая поликлиника', 'Детская поликлиника',
  ], desc: 'Поликлиника с {access} для посетителей.', hours: '08:00-18:00' },
  { cat: 'pharmacy', names: [
    'Аптека "Здоровье"', 'Аптека "Фармация"', 'Аптека "Доктор"', 'Аптека "Максавит"',
    'Аптека "36.6"', 'Аптека "Живика"', 'Аптека "Будь здоров"', 'Аптека "Ладушка"',
  ], desc: 'Аптека с {access}.', hours: '08:00-21:00' },
  { cat: 'shop', names: [
    'Магазин "Магнит"', 'Магазин "Пятёрочка"', 'Магазин "Перекрёсток"', 'Магазин "Fix Price"',
    'ТЦ "{city_adj}"', 'Магазин "Лента"', 'Универсам "Центральный"', 'Магазин "Светофор"',
  ], desc: 'Магазин с {access} для покупателей.', hours: '08:00-22:00' },
  { cat: 'bank', names: [
    'Сбербанк', 'ВТБ', 'Альфа-Банк', 'Т-Банк', 'Россельхозбанк', 'Банк "Центр-Инвест"',
    'Почта Банк', 'Газпромбанк',
  ], desc: 'Отделение банка с {access}.', hours: '09:00-18:00, Пн-Пт' },
  { cat: 'park', names: [
    'Городской парк', 'Парк Победы', 'Парк культуры', 'Сквер им. Пушкина',
    'Парк "Юбилейный"', 'Центральный парк', 'Парк отдыха', 'Аллея Славы',
  ], desc: 'Парк с {access} для прогулок.', hours: 'Круглосуточно' },
  { cat: 'education', names: [
    'Школа N{n}', 'Гимназия N{n}', 'Лицей N{n}', 'Школа искусств',
    'Детский сад N{n}', 'Колледж', 'Техникум', 'Библиотека',
  ], desc: 'Образовательное учреждение с {access}.', hours: '08:00-17:00' },
  { cat: 'culture', names: [
    'Музей истории', 'Краеведческий музей', 'Дом культуры', 'Выставочный зал',
    'Библиотека им. Горького', 'Детская библиотека', 'Музей казачества',
  ], desc: 'Учреждение культуры с {access}.', hours: '10:00-18:00' },
  { cat: 'sport', names: [
    'Спортивный комплекс', 'Физкультурно-оздоровительный комплекс', 'Бассейн', 'Стадион',
    'Тренажёрный зал "Олимп"', 'Спортшкола',
  ], desc: 'Спортивный объект с {access}.', hours: '07:00-22:00' },
  { cat: 'government', names: [
    'Администрация', 'МФЦ', 'Пенсионный фонд', 'ЗАГС', 'Почта России',
    'Налоговая инспекция', 'Центр занятости', 'Социальная защита',
  ], desc: 'Государственное учреждение с {access}.', hours: '09:00-17:00, Пн-Пт' },
  { cat: 'transport_stop', names: [
    'Автовокзал', 'Ж/д вокзал', 'Остановка "Центральная"', 'Остановка "Рынок"',
    'Остановка "Больница"', 'Остановка "Школа"',
  ], desc: 'Транспортный узел с {access}.', hours: null },
  { cat: 'crossing', names: [
    'Пешеходный переход у администрации', 'Переход у рынка', 'Переход на центральной площади',
    'Переход у парка', 'Переход у школы',
  ], desc: 'Пешеходный переход с {access}.', hours: null },
  { cat: 'toilet', names: [
    'Общественный туалет в парке', 'Туалет у автовокзала', 'Туалет в ТЦ',
    'Туалет у рынка', 'Туалет в администрации',
  ], desc: 'Общественный санузел с {access}.', hours: '08:00-20:00' },
  { cat: 'theater', names: [
    'Городской театр', 'Дом культуры', 'Концертный зал', 'Молодёжный театр',
  ], desc: 'Театр/концертный зал с {access}.', hours: '10:00-19:00' },
  { cat: 'cinema', names: [
    'Кинотеатр "Победа"', 'Кинотеатр "Юбилейный"', 'Кинотеатр "Мир"', 'Кинотеатр "Октябрь"',
  ], desc: 'Кинотеатр с {access}.', hours: '10:00-23:00' },
]

const ACCESS_DESCRIPTIONS = [
  'пандусом и широкими дверями',
  'пандусом, лифтом и доступным санузлом',
  'ровным входом и низкими прилавками',
  'безбарьерным входом и поручнями',
  'подъёмником и обученным персоналом',
  'кнопкой вызова и автоматическими дверями',
  'тактильной навигацией и контрастной разметкой',
  'доступным входом и визуальными указателями',
  'пандусом и парковкой для инвалидов',
  'пандусом, доступным санузлом и широкими проходами',
  'лифтом, тактильной плиткой и индукционной петлёй',
  'автоматическими дверями и низкой стойкой',
]

const CITY_ADJECTIVES = {
  'Ростов-на-Дону': 'Ростовский',
  'Таганрог': 'Таганрогский',
  'Шахты': 'Шахтинский',
  'Новочеркасск': 'Новочеркасский',
  'Волгодонск': 'Волгодонский',
  'Батайск': 'Батайский',
  'Новошахтинск': 'Новошахтинский',
  'Каменск-Шахтинский': 'Каменский',
  'Азов': 'Азовский',
  'Гуково': 'Гуковский',
  'Донецк (РО)': 'Донецкий',
  'Сальск': 'Сальский',
  'Миллерово': 'Миллеровский',
  'Аксай': 'Аксайский',
  'Белая Калитва': 'Калитвинский',
  'Красный Сулин': 'Сулинский',
  'Морозовск': 'Морозовский',
  'Семикаракорск': 'Семикаракорский',
  'Зерноград': 'Зерноградский',
  'Константиновск': 'Константиновский',
  'Цимлянск': 'Цимлянский',
  'Пролетарск': 'Пролетарский',
  'Зверево': 'Зверевский',
}

// Tag combinations by category
const TAG_COMBOS = {
  restaurant: [
    [1,3,4,6,8,31,33], [1,3,6,8,20,31,33], [1,3,4,6,8,14,31], [1,2,3,4,8,10,17,31],
    [1,3,6,8,31], [1,4,6,8,20,31,33], [1,3,6,8,33], [1,7,3,4,8,14,20,31,33],
  ],
  cafe: [
    [1,3,6,8,31,33], [1,3,4,6,8,10,20,31,33], [1,6,8,33,31], [1,3,6,8,11,31],
    [1,3,6,8,20,31,33], [1,3,6,8,31], [1,6,8,33], [1,3,4,6,8,14,20,31,33],
  ],
  hospital: [
    [1,2,3,4,5,6,7,9,11,13,17,22,24,31], [1,2,3,4,5,7,9,11,13,17,22,31,34],
    [1,2,3,4,7,9,17,31,32,35], [1,2,3,4,5,6,7,9,11,13,17,22,24,25,28,31],
  ],
  clinic: [
    [1,2,3,4,7,9,13,17,22,25,28,31], [1,2,3,4,9,13,17,22,31],
    [1,3,4,7,9,10,13,22,24,31], [1,2,3,4,9,10,22,24,31],
  ],
  pharmacy: [
    [1,6,8,10,15,18], [1,6,8,11,18], [1,6,8,10,18], [1,6,8,18],
  ],
  shop: [
    [1,2,3,4,5,6,7,8,9,11,13,15,17,22,24,28,31], [1,3,5,6,8,11,15,28],
    [1,3,6,8,15], [5,6,15,28], [1,2,4,5,7,8,11,17,28,31],
  ],
  bank: [
    [1,3,6,8,10,11,15,22,25,27,28,31], [1,3,6,8,11,15,22,28,31],
    [1,3,6,8,10,27,28,31], [1,3,6,8,11,28,31],
  ],
  park: [
    [6,9,13,15,19,20,21,28,29,32], [6,9,13,15,20,28,29],
    [1,6,9,13,15,19,20,21,28,29,31,32], [1,6,9,13,15,20,28,29],
    [6,9,13,15,28,29], [6,9,19,20,28,31],
  ],
  education: [
    [1,2,4,7,9,13,22,24,28,29,31,32], [1,2,3,4,7,9,13,17,22,24,28,31,32],
    [1,2,4,6,9,14,17,18,19,20,29,31], [1,2,3,4,7,9,13,17,28,31,34],
    [1,2,3,4,7,9,13,14,17,22,28,29,31,32,34],
  ],
  culture: [
    [1,2,4,7,13,14,17,19,20,21,28,29,31], [1,2,4,13,14,17,18,19,20,22,29,31],
    [1,6,14,19,21,28,31], [1,2,4,13,14,17,19,21,28,31],
    [1,2,4,7,9,22,28,31,36],
  ],
  sport: [
    [1,2,3,4,5,7,9,11,13,17,22,28,31,34], [1,2,4,5,7,9,11,13,22,31,34],
    [1,2,4,7,9,11,31,34], [1,2,4,5,7,9,11,13,17,22,24,28,31,36],
  ],
  government: [
    [1,2,3,4,5,7,8,9,11,13,14,17,18,22,24,25,27,28,30,31],
    [1,6,8,10,15,28,31], [1,2,3,4,6,9,17,28,31],
    [1,3,7,8,10,22,24,28,31], [1,3,4,7,8,10,22,25,28,31],
  ],
  transport_stop: [
    [6,13,15,16,24,30], [1,2,4,5,6,7,9,13,15,16,17,22,24,28,30,31],
    [6,13,15,24,30],
  ],
  crossing: [
    [6,13,15,16,26], [2,6,13,15,16,26], [2,6,13,15,16,17,26],
  ],
  toilet: [
    [1,4,6,9,37,38,35], [1,4,6,37,38,35], [1,4,6,9,11,37,38,35],
    [1,4,6,37,38], [1,4,6,9,37,38],
  ],
  theater: [
    [1,2,4,7,9,13,17,22,23,25,28,31,36,39], [1,2,4,7,9,17,22,25,28,31,36,39,41],
    [1,4,6,9,28,31,32,42], [1,4,6,9,31,36],
  ],
  cinema: [
    [1,2,4,5,7,17,22,23,28,31,36], [1,2,4,5,7,11,17,22,23,28,31,36,39],
    [1,4,7,22,23,31,36], [1,6,23,31,36],
  ],
}

// ======================== HELPER FUNCTIONS ========================
function rng(seed) {
  let s = seed
  return function() {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

const random = rng(42)

function randInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min
}

function pick(arr) {
  return arr[Math.floor(random() * arr.length)]
}

function jitter(base, range) {
  return base + (random() - 0.5) * 2 * range
}

function generatePhone(city) {
  if (city.name === 'Ростов-на-Дону') {
    return `+7 (863) ${randInt(200,310)}-${String(randInt(10,99)).padStart(2,'0')}-${String(randInt(10,99)).padStart(2,'0')}`
  }
  const codes = ['863','8635','86365','86372','86394','86360','86352','86350','86376','86349']
  const code = pick(codes)
  return `+7 (${code}) ${randInt(2,9)}-${String(randInt(10,99)).padStart(2,'0')}-${String(randInt(10,99)).padStart(2,'0')}`
}

// ======================== GENERATE PLACES ========================
const places = []
let nextId = 161  // continue from existing 160 places

// Calculate total weight
const totalWeight = CITIES.reduce((sum, c) => sum + c.weight, 0)
const TARGET = 1840  // to reach ~2000 with existing 160

for (const city of CITIES) {
  const count = Math.max(2, Math.round((city.weight / totalWeight) * TARGET))
  
  const streets = city.name === 'Ростов-на-Дону' ? ROSTOV_STREETS : 
    (city.weight >= 3 ? STREETS_BIG : STREETS_SMALL)
  
  const latRange = city.weight >= 5 ? 0.03 : (city.weight >= 2 ? 0.015 : 0.008)
  const lngRange = city.weight >= 5 ? 0.04 : (city.weight >= 2 ? 0.02 : 0.01)
  
  const usedNames = new Set()
  
  for (let i = 0; i < count; i++) {
    const catObj = pick(CATEGORIES)
    let nameTemplate = pick(catObj.names)
    
    const adj = CITY_ADJECTIVES[city.name] || city.name.replace(/[()]/g, '')
    nameTemplate = nameTemplate.replace('{city_adj}', adj)
    nameTemplate = nameTemplate.replace('{n}', String(randInt(1, 50)))
    
    // Avoid duplicates per city
    const fullName = city.name === 'Ростов-на-Дону' ? nameTemplate : `${nameTemplate}`
    if (usedNames.has(fullName)) {
      nameTemplate = nameTemplate + ` (${pick(['филиал','отд.','N' + randInt(1,10)])})`
    }
    usedNames.add(fullName)
    
    const street = pick(streets)
    const houseNum = randInt(1, 200)
    const address = city.name === 'Ростов-на-Дону' 
      ? `${street}, ${houseNum}`
      : `${city.prefix}, ${street}, ${houseNum}`
    
    const accessDesc = pick(ACCESS_DESCRIPTIONS)
    const desc = catObj.desc.replace('{access}', accessDesc)
    
    const lat = jitter(city.lat, latRange)
    const lng = jitter(city.lng, lngRange)
    
    const tagCombo = pick(TAG_COMBOS[catObj.cat] || TAG_COMBOS.shop)
    
    const rating = (3.0 + random() * 2.0)
    const roundedRating = Math.round(rating * 10) / 10

    const phone = (catObj.cat === 'crossing' || catObj.cat === 'park' || catObj.cat === 'transport_stop') && random() > 0.3
      ? null : generatePhone(city)

    const dateOffset = nextId * 3600000
    const created = new Date(Date.parse('2025-01-01T00:00:00Z') + dateOffset).toISOString()

    places.push({
      id: nextId++,
      name: nameTemplate,
      description: desc,
      category: catObj.cat,
      address,
      latitude: Math.round(lat * 10000) / 10000,
      longitude: Math.round(lng * 10000) / 10000,
      phone,
      website: null,
      working_hours: catObj.hours,
      photo_url: null,
      overall_rating: roundedRating,
      review_count: randInt(1, 60),
      added_by: null,
      created_at: created,
      updated_at: created,
      tags: tagCombo,
    })
  }
}

console.log(`Generated ${places.length} additional places (IDs ${161}-${nextId - 1})`)
console.log(`Total places: ${160 + places.length}`)

// ======================== BUILD THE FILE ========================

// Read the existing mock-data.ts file
const existingFile = fs.readFileSync(path.join(process.cwd(), 'lib/mock-data.ts'), 'utf-8')

// Find the closing bracket of mockPlaces array (before mockReviews)
const closingIndex = existingFile.indexOf('\n]\n\nexport const mockReviews')
if (closingIndex === -1) {
  console.error('Could not find mockPlaces closing bracket')
  process.exit(1)
}

// Generate the new places as TypeScript
const newPlacesCode = places.map(p => {
  const tagsStr = p.tags.map(tid => `t(${tid})`).join(', ')
  const phone = p.phone ? `'${p.phone}'` : 'null'
  const hours = p.working_hours ? `'${p.working_hours}'` : 'null'
  return `  { id: ${p.id}, name: '${p.name.replace(/'/g, "\\'")}', description: '${p.description.replace(/'/g, "\\'")}', category: '${p.category}', address: '${p.address.replace(/'/g, "\\'")}', latitude: ${p.latitude}, longitude: ${p.longitude}, phone: ${phone}, website: null, working_hours: ${hours}, photo_url: null, overall_rating: ${p.overall_rating}, review_count: ${p.review_count}, added_by: null, created_at: '${p.created_at}', updated_at: '${p.updated_at}', tags: [${tagsStr}] },`
}).join('\n')

// Insert the new places before the closing bracket
const newFile = existingFile.slice(0, closingIndex) + '\n\n  // ====================== СГЕНЕРИРОВАННЫЕ МЕСТА ПО РОСТОВСКОЙ ОБЛАСТИ ======================\n' + newPlacesCode + '\n' + existingFile.slice(closingIndex)

fs.writeFileSync(path.join(process.cwd(), 'lib/mock-data.ts'), newFile, 'utf-8')

console.log('Updated lib/mock-data.ts successfully!')
console.log('City distribution:')
for (const city of CITIES) {
  const count = Math.max(2, Math.round((city.weight / totalWeight) * TARGET))
  console.log(`  ${city.name}: ${count} places`)
}
