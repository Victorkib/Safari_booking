import { pgTable, text, timestamp, boolean, integer, decimal, date, jsonb } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('customer'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// Add your app tables below. Always include a plain `userId` column so queries
// can be scoped per user — the security model depends on this column existing,
// not on a foreign key. Do NOT add a foreign key constraint
// (`.references(() => user.id, ...)`) unless the user explicitly asks for
// foreign keys or referential integrity; FK constraints make iterating on the
// schema harder.
//
// Example:
//
// import { serial } from "drizzle-orm/pg-core"
//
// export const todos = pgTable("todos", {
//   id: serial("id").primaryKey(),
//   userId: text("userId").notNull(),
//   title: text("title").notNull(),
//   completed: boolean("completed").notNull().default(false),
//   createdAt: timestamp("createdAt").notNull().defaultNow(),
// })
//
// If the user asks for foreign keys, add the reference back in:
//   userId: text("userId")
//     .notNull()
//     .references(() => user.id, { onDelete: "cascade" }),

// --- Safari Packages -------------------------------------------------------
export const safariPackages = pgTable('safari_packages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  duration_days: integer('duration_days').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('KES'),
  difficulty_level: text('difficulty_level'),
  group_size_min: integer('group_size_min').default(1),
  group_size_max: integer('group_size_max').default(12),
  destinations: text('destinations').array(),
  highlights: text('highlights').array(),
  included_services: text('included_services').array(),
  excluded_items: text('excluded_items').array(),
  images: text('images').array(),
  status: text('status').default('active'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Destinations ----------------------------------------------------------
export const destinations = pgTable('destinations', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  country: text('country').notNull(),
  region: text('region'),
  description: text('description'),
  highlights: text('highlights').array(),
  best_season: text('best_season'),
  wildlife: text('wildlife').array(),
  image_url: text('image_url'),
  coordinates: jsonb('coordinates'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Bookings --------------------------------------------------------------
export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  package_id: text('package_id').notNull(),
  driver_id: text('driver_id'),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  number_of_guests: integer('number_of_guests').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('pending'),
  special_requests: text('special_requests'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Payments --------------------------------------------------------------
export const payments = pgTable('payments', {
  id: text('id').primaryKey(),
  booking_id: text('booking_id').notNull(),
  userId: text('userId').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('KES'),
  status: text('status').default('pending'),
  payment_method: text('payment_method'),
  transaction_id: text('transaction_id').unique(),
  mpesa_receipt: text('mpesa_receipt'),
  mpesa_phone: text('mpesa_phone'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Vehicles --------------------------------------------------------------
export const vehicles = pgTable('vehicles', {
  id: text('id').primaryKey(),
  registration_number: text('registration_number').notNull().unique(),
  vehicle_type: text('vehicle_type').notNull(),
  make_model: text('make_model').notNull(),
  seating_capacity: integer('seating_capacity').notNull(),
  license_expiry: date('license_expiry'),
  insurance_expiry: date('insurance_expiry'),
  status: text('status').default('active'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Drivers ---------------------------------------------------------------
export const drivers = pgTable('drivers', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  license_number: text('license_number').notNull().unique(),
  license_expiry: date('license_expiry').notNull(),
  experience_years: integer('experience_years'),
  vehicle_id: text('vehicle_id'),
  status: text('status').default('available'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Itineraries -----------------------------------------------------------
export const itineraries = pgTable('itineraries', {
  id: text('id').primaryKey(),
  package_id: text('package_id').notNull(),
  day_number: integer('day_number').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  activities: text('activities').array(),
  meals: text('meals').array(),
  accommodation: text('accommodation'),
  distance_km: decimal('distance_km', { precision: 5, scale: 2 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// --- Quotations ------------------------------------------------------------
export const quotations = pgTable('quotations', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  package_id: text('package_id').notNull(),
  custom_duration: integer('custom_duration'),
  number_of_people: integer('number_of_people').notNull(),
  estimated_price: decimal('estimated_price', { precision: 10, scale: 2 }).notNull(),
  special_requirements: text('special_requirements'),
  status: text('status').default('draft'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

// --- Reviews ---------------------------------------------------------------
export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  booking_id: text('booking_id').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

// --- Analytics -------------------------------------------------------------
export const analytics = pgTable('analytics', {
  id: text('id').primaryKey(),
  booking_id: text('booking_id'),
  event_type: text('event_type').notNull(),
  revenue: decimal('revenue', { precision: 10, scale: 2 }),
  user_count: integer('user_count'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})
