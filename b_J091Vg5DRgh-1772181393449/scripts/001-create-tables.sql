-- Accessible Navigation Platform for Rostov-on-Don
-- Database schema: users, places, accessibility_tags, place_tags, reviews, media

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Place categories enum
DO $$ BEGIN
  CREATE TYPE place_category AS ENUM (
    'cafe','restaurant','hospital','clinic','pharmacy','shop','bank',
    'park','crossing','transport_stop','government','education','culture','sport','other'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Places / Points of Interest
CREATE TABLE IF NOT EXISTS places (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category place_category NOT NULL DEFAULT 'other',
  address VARCHAR(500),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(500),
  working_hours VARCHAR(255),
  photo_url TEXT,
  overall_rating NUMERIC(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  added_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accessibility tags
CREATE TABLE IF NOT EXISTS accessibility_tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  icon VARCHAR(50),
  disability_category VARCHAR(100) NOT NULL,
  description TEXT
);

-- Many-to-many: places <-> tags
CREATE TABLE IF NOT EXISTS place_tags (
  place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES accessibility_tags(id) ON DELETE CASCADE,
  verified BOOLEAN DEFAULT FALSE,
  added_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (place_id, tag_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  place_id INTEGER REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  accessibility_rating INTEGER CHECK (accessibility_rating >= 1 AND accessibility_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media attachments
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  place_id INTEGER REFERENCES places(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  media_type VARCHAR(20) DEFAULT 'image',
  uploaded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_coords ON places(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_place_tags_tag ON place_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_reviews_place ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

-- ========== SEED DATA ==========

-- Demo user
INSERT INTO users (name, email) VALUES
  ('Демо Пользователь', 'demo@dostuprost.ru')
ON CONFLICT (email) DO NOTHING;

-- Accessibility tags
INSERT INTO accessibility_tags (name, slug, icon, disability_category, description) VALUES
  ('Пандус', 'ramp', 'accessibility', 'mobility', 'Наличие пандуса на входе'),
  ('Лифт', 'elevator', 'arrow-up-down', 'mobility', 'Наличие лифта для колясок'),
  ('Широкие проходы', 'wide-doors', 'move-horizontal', 'mobility', 'Дверные проёмы от 90 см'),
  ('Доступный туалет', 'accessible-toilet', 'bath', 'mobility', 'Туалет для маломобильных граждан'),
  ('Парковка МГН', 'parking-mgn', 'car', 'mobility', 'Выделенная парковка для инвалидов'),
  ('Низкий пол', 'low-floor', 'minus', 'mobility', 'Отсутствие ступеней при входе'),
  ('Тактильная плитка', 'tactile-tiles', 'grid-3x3', 'vision', 'Тактильные направляющие для незрячих'),
  ('Шрифт Брайля', 'braille', 'book-open', 'vision', 'Надписи и указатели по Брайлю'),
  ('Звуковые сигналы', 'audio-signals', 'volume-2', 'vision', 'Звуковое дублирование информации'),
  ('Контрастная маркировка', 'contrast-marking', 'contrast', 'vision', 'Контрастная разметка ступеней и дверей'),
  ('Сурдоперевод', 'sign-language', 'hand', 'hearing', 'Сотрудники знают жестовый язык'),
  ('Индукционная петля', 'induction-loop', 'headphones', 'hearing', 'Индукционное оборудование для слуховых аппаратов'),
  ('Текстовое табло', 'text-display', 'monitor', 'hearing', 'Электронное текстовое информирование'),
  ('Простая навигация', 'easy-navigation', 'compass', 'cognitive', 'Понятные указатели и планировка'),
  ('Помощь персонала', 'staff-assistance', 'heart-handshake', 'cognitive', 'Персонал готов помочь')
ON CONFLICT (slug) DO NOTHING;

-- Sample places in Rostov-on-Don
INSERT INTO places (name, description, category, address, latitude, longitude, phone, working_hours, overall_rating, review_count, added_by) VALUES
  ('Кофейня «Тихий Дон»', 'Уютная кофейня с полностью безбарьерной средой и вкусным кофе', 'cafe', 'ул. Большая Садовая, 47', 47.2277, 39.7187, '+7 (863) 200-00-01', '08:00–22:00', 4.5, 12, 1),
  ('Поликлиника №5', 'Городская поликлиника с доступной средой для всех категорий граждан', 'hospital', 'пр. Будённовский, 80', 47.2361, 39.7130, '+7 (863) 200-00-02', '08:00–20:00', 4.0, 8, 1),
  ('Аптека «Здоровье»', 'Аптека с пандусом и низкими стойками обслуживания', 'pharmacy', 'ул. Красноармейская, 120', 47.2200, 39.7100, '+7 (863) 200-00-03', '08:00–21:00', 3.8, 5, 1),
  ('ТЦ «Горизонт»', 'Торговый центр с лифтами, широкими проходами и доступными туалетами', 'shop', 'пр. Нагибина, 32', 47.2440, 39.7280, '+7 (863) 200-00-04', '10:00–22:00', 4.2, 15, 1),
  ('РГЭУ (РИНХ)', 'Университет с частично адаптированной средой для студентов с ОВЗ', 'education', 'ул. Большая Садовая, 69', 47.2289, 39.7230, '+7 (863) 200-00-05', '08:00–18:00', 3.5, 6, 1),
  ('Ростовский музей ИЗО', 'Музей с лифтом, аудиогидом и тактильными экспонатами', 'culture', 'ул. Пушкинская, 115', 47.2250, 39.7350, '+7 (863) 200-00-06', '10:00–18:00', 4.3, 10, 1),
  ('Остановка «Центральный рынок»', 'Остановка общественного транспорта с низкопольными автобусами', 'transport_stop', 'пр. Будённовский, 56', 47.2295, 39.7150, NULL, 'Круглосуточно', 3.0, 4, 1),
  ('МФЦ Ростова', 'Многофункциональный центр госуслуг с полной доступностью', 'government', 'ул. Суворова, 91', 47.2310, 39.7200, '+7 (863) 200-00-08', '09:00–18:00', 4.7, 20, 1),
  ('Парк им. Горького', 'Центральный парк с доступными дорожками и зонами отдыха', 'park', 'ул. Большая Садовая, 45', 47.2270, 39.7170, NULL, '06:00–23:00', 4.1, 9, 1),
  ('Переход на Ворошиловском', 'Подземный переход с пандусом (крутой уклон)', 'crossing', 'пр. Ворошиловский / ул. Б. Садовая', 47.2283, 39.7210, NULL, 'Круглосуточно', 2.5, 7, 1)
ON CONFLICT DO NOTHING;

-- Link places with accessibility tags
INSERT INTO place_tags (place_id, tag_id, verified, added_by) VALUES
  -- Кофейня: пандус, широкие проходы, низкий пол, помощь персонала
  (1,1,true,1),(1,3,true,1),(1,6,true,1),(1,15,true,1),
  -- Поликлиника: пандус, лифт, широкие проходы, доступный туалет, парковка МГН, тактильная плитка, сурдоперевод
  (2,1,true,1),(2,2,true,1),(2,3,true,1),(2,4,true,1),(2,5,true,1),(2,7,true,1),(2,11,true,1),
  -- Аптека: пандус, низкий пол
  (3,1,true,1),(3,6,true,1),
  -- ТЦ: пандус, лифт, широкие проходы, доступный туалет, парковка МГН, тактильная плитка
  (4,1,true,1),(4,2,true,1),(4,3,true,1),(4,4,true,1),(4,5,true,1),(4,7,true,1),
  -- РГЭУ: пандус, лифт (не верифицирован), простая навигация
  (5,1,true,1),(5,2,false,1),(5,14,true,1),
  -- Музей: пандус, лифт, звуковые сигналы, контрастная маркировка
  (6,1,true,1),(6,2,true,1),(6,9,true,1),(6,10,true,1),
  -- Остановка: низкий пол, текстовое табло
  (7,6,true,1),(7,13,true,1),
  -- МФЦ: полный набор
  (8,1,true,1),(8,2,true,1),(8,3,true,1),(8,4,true,1),(8,5,true,1),(8,7,true,1),(8,8,true,1),(8,9,true,1),(8,11,true,1),(8,13,true,1),(8,14,true,1),(8,15,true,1),
  -- Парк: тактильная плитка, контрастная маркировка, простая навигация
  (9,7,true,1),(9,10,true,1),(9,14,true,1),
  -- Переход: пандус, контрастная маркировка
  (10,1,true,1),(10,10,true,1)
ON CONFLICT DO NOTHING;

-- Sample reviews
INSERT INTO reviews (place_id, user_id, rating, accessibility_rating, comment) VALUES
  (1, 1, 5, 5, 'Отличная кофейня! Всё полностью доступно, персонал очень отзывчивый.'),
  (2, 1, 4, 4, 'Поликлиника старается, но навигация внутри могла бы быть лучше.'),
  (4, 1, 4, 5, 'ТЦ с хорошей доступностью. Лифты работают, проходы широкие.'),
  (8, 1, 5, 5, 'Лучший пример доступной среды в городе! Всё продумано до мелочей.'),
  (10, 1, 2, 2, 'Пандус есть, но очень крутой. Без помощи сложно подняться.')
ON CONFLICT DO NOTHING;
