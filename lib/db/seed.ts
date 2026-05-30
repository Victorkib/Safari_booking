import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { nanoid } from 'nanoid'
import { hashPassword } from 'better-auth/crypto'
import * as schema from './schema'

config({ path: '.env.local' })

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const db = drizzle(pool, { schema })

// Stable IDs so re-running seed is predictable
const IDS = {
  destinations: {
    maasaiMara: 'dest_maasai_mara',
    amboseli: 'dest_amboseli',
    tsavo: 'dest_tsavo',
    samburu: 'dest_samburu',
    lakeNakuru: 'dest_lake_nakuru',
  },
  packages: {
    classicMara: 'pkg_classic_mara',
    bigFive: 'pkg_big_five',
    photographer: 'pkg_photographer',
    family: 'pkg_family_safari',
    luxury: 'pkg_luxury_escape',
  },
  vehicles: {
    landCruiser1: 'veh_lc_001',
    landCruiser2: 'veh_lc_002',
    safariVan: 'veh_van_001',
  },
  users: {
    admin: 'user_admin_demo',
    driver: 'user_driver_demo',
    customer: 'user_customer_demo',
  },
  drivers: {
    james: 'drv_james_kamau',
  },
}

const DEMO_PASSWORD = 'SafariDemo123!'

async function seedUsers() {
  const hashed = await hashPassword(DEMO_PASSWORD)
  const now = new Date()

  const users = [
    {
      id: IDS.users.admin,
      name: 'Admin User',
      email: 'admin@safari.test',
      role: 'admin',
    },
    {
      id: IDS.users.driver,
      name: 'James Kamau',
      email: 'driver@safari.test',
      role: 'driver',
    },
    {
      id: IDS.users.customer,
      name: 'Jane Wanjiku',
      email: 'customer@safari.test',
      role: 'customer',
    },
  ]

  for (const u of users) {
    await db
      .insert(schema.user)
      .values({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: true,
        role: u.role,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: schema.user.email,
        set: { name: u.name, role: u.role, updatedAt: now },
      })

    await db
      .insert(schema.account)
      .values({
        id: nanoid(),
        accountId: u.email,
        providerId: 'credential',
        userId: u.id,
        password: hashed,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoNothing()
  }

  console.log('✓ Demo users seeded (password: SafariDemo123!)')
  console.log('  admin@safari.test   → admin')
  console.log('  driver@safari.test  → driver')
  console.log('  customer@safari.test → customer')
}

async function seedDestinations() {
  const destinations = [
    {
      id: IDS.destinations.maasaiMara,
      name: 'Maasai Mara',
      country: 'Kenya',
      region: 'Rift Valley',
      description:
        'World-famous reserve known for the Great Migration, big cats, and endless golden savannah.',
      highlights: ['Great Migration', 'Big Five', 'Hot air balloon safaris'],
      best_season: 'Jul–Oct (migration), Jan–Mar (calving)',
      wildlife: ['Lion', 'Leopard', 'Elephant', 'Wildebeest', 'Cheetah'],
      coordinates: { lat: -1.4061, lng: 35.0017 },
    },
    {
      id: IDS.destinations.amboseli,
      name: 'Amboseli',
      country: 'Kenya',
      region: 'Kajiado',
      description:
        'Iconic views of Mount Kilimanjaro and large elephant herds on open plains.',
      highlights: ['Kilimanjaro views', 'Elephant herds', 'Swamps & birdlife'],
      best_season: 'Jun–Oct (dry season)',
      wildlife: ['Elephant', 'Buffalo', 'Lion', 'Flamingo', 'Hyena'],
      coordinates: { lat: -2.6527, lng: 37.2606 },
    },
    {
      id: IDS.destinations.tsavo,
      name: 'Tsavo East & West',
      country: 'Kenya',
      region: 'Coast Province',
      description:
        'Kenya\'s largest national park — red elephants, rugged terrain, and remote wilderness.',
      highlights: ['Red elephants', 'Mudanda Rock', 'Mzima Springs'],
      best_season: 'May–Oct',
      wildlife: ['Elephant', 'Rhino', 'Leopard', 'Hippo', 'Crocodile'],
      coordinates: { lat: -2.9833, lng: 38.4667 },
    },
    {
      id: IDS.destinations.samburu,
      name: 'Samburu',
      country: 'Kenya',
      region: 'Northern Kenya',
      description:
        'Arid beauty with species rarely seen elsewhere — Grevy\'s zebra, reticulated giraffe, oryx.',
      highlights: ['Special five', 'Ewaso Ng\'iro river', 'Samburu culture'],
      best_season: 'Jun–Oct, Dec–Mar',
      wildlife: ['Grevy\'s Zebra', 'Reticulated Giraffe', 'Oryx', 'Gerenuk', 'Lion'],
      coordinates: { lat: 0.5697, lng: 37.5342 },
    },
    {
      id: IDS.destinations.lakeNakuru,
      name: 'Lake Nakuru',
      country: 'Kenya',
      region: 'Rift Valley',
      description:
        'Rift Valley lake sanctuary famous for rhinos, flamingos, and acacia woodlands.',
      highlights: ['Rhino sanctuary', 'Flamingo flocks', 'Baboon Cliff'],
      best_season: 'Year-round',
      wildlife: ['Rhino', 'Flamingo', 'Leopard', 'Buffalo', 'Pelican'],
      coordinates: { lat: -0.356, lng: 36.09 },
    },
  ]

  for (const dest of destinations) {
    await db.insert(schema.destinations).values(dest).onConflictDoNothing()
  }
  console.log(`✓ ${destinations.length} destinations seeded`)
}

async function seedVehicles() {
  const vehicles = [
    {
      id: IDS.vehicles.landCruiser1,
      registration_number: 'KDA 452A',
      vehicle_type: '4x4 Safari Land Cruiser',
      make_model: 'Toyota Land Cruiser V8',
      seating_capacity: 7,
      license_expiry: '2027-06-30',
      insurance_expiry: '2026-12-31',
      status: 'active',
    },
    {
      id: IDS.vehicles.landCruiser2,
      registration_number: 'KDB 891B',
      vehicle_type: '4x4 Safari Land Cruiser',
      make_model: 'Toyota Land Cruiser TX',
      seating_capacity: 7,
      license_expiry: '2027-03-15',
      insurance_expiry: '2026-11-30',
      status: 'active',
    },
    {
      id: IDS.vehicles.safariVan,
      registration_number: 'KDC 112C',
      vehicle_type: 'Safari Van',
      make_model: 'Toyota HiAce Custom',
      seating_capacity: 9,
      license_expiry: '2026-09-20',
      insurance_expiry: '2026-08-15',
      status: 'active',
    },
  ]

  for (const v of vehicles) {
    await db.insert(schema.vehicles).values(v).onConflictDoNothing()
  }
  console.log(`✓ ${vehicles.length} vehicles seeded`)
}

async function seedPackages() {
  const packages = [
    {
      id: IDS.packages.classicMara,
      title: 'Classic Maasai Mara Safari',
      description:
        'Three unforgettable days in the Maasai Mara — morning and afternoon game drives, comfortable lodge accommodation, and expert guides tracking the Big Five across the savannah.',
      duration_days: 3,
      price: '85000.00',
      difficulty_level: 'easy',
      group_size_min: 2,
      group_size_max: 8,
      destinations: ['Maasai Mara'],
      highlights: [
        'Daily game drives in 4x4',
        'Big Five spotting',
        'Bush breakfast experience',
        'Professional safari guide',
      ],
      included_services: [
        'Park fees',
        'Accommodation (2 nights)',
        'All meals',
        'Transport from Nairobi',
        'Game drives',
      ],
      excluded_items: ['Tips', 'Personal insurance', 'Alcoholic beverages'],
      images: ['/placeholder.svg?height=400&width=600'],
      status: 'active',
    },
    {
      id: IDS.packages.bigFive,
      title: 'Big Five Explorer — Mara & Amboseli',
      description:
        'A week-long journey through Kenya\'s two most iconic parks. Witness predators in the Mara and elephant herds beneath Kilimanjaro in Amboseli.',
      duration_days: 7,
      price: '195000.00',
      difficulty_level: 'moderate',
      group_size_min: 2,
      group_size_max: 6,
      destinations: ['Maasai Mara', 'Amboseli'],
      highlights: [
        'Two premier national parks',
        'Kilimanjaro sunrise views',
        'Night game drive (Mara)',
        'Cultural village visit',
      ],
      included_services: [
        'All park fees',
        '6 nights accommodation',
        'Full board meals',
        'Internal flights optional add-on',
        'Dedicated guide & vehicle',
      ],
      excluded_items: ['International flights', 'Visa fees', 'Travel insurance'],
      images: ['/placeholder.svg?height=400&width=600'],
      status: 'active',
    },
    {
      id: IDS.packages.photographer,
      title: 'Photographer\'s Dream Safari',
      description:
        'Designed for wildlife photographers — extended golden-hour drives, hide sessions, and guides who understand light, composition, and animal behaviour.',
      duration_days: 5,
      price: '165000.00',
      difficulty_level: 'moderate',
      group_size_min: 1,
      group_size_max: 4,
      destinations: ['Maasai Mara', 'Lake Nakuru'],
      highlights: [
        'Golden hour priority drives',
        'Photography hide access',
        'Small group (max 4)',
        'Image review sessions',
      ],
      included_services: [
        'Park fees',
        '4 nights lodge/camp',
        'All meals',
        'Roof-hatch 4x4 vehicle',
        'Photography guide',
      ],
      excluded_items: ['Camera equipment', 'Lens rental', 'Tips'],
      images: ['/placeholder.svg?height=400&width=600'],
      status: 'active',
    },
    {
      id: IDS.packages.family,
      title: 'Family Safari Adventure',
      description:
        'Kid-friendly safari with shorter drive times, educational bush walks, and family lodges with pools. Perfect introduction to African wildlife for all ages.',
      duration_days: 4,
      price: '120000.00',
      difficulty_level: 'easy',
      group_size_min: 3,
      group_size_max: 10,
      destinations: ['Amboseli', 'Lake Nakuru'],
      highlights: [
        'Junior ranger program',
        'Shorter, kid-paced drives',
        'Family rooms available',
        'Swimming pool at lodge',
      ],
      included_services: [
        'Park fees',
        '3 nights family accommodation',
        'All meals + kid menus',
        'Transport & guide',
        'Bottled water',
      ],
      excluded_items: ['Baby equipment rental', 'Babysitting', 'Tips'],
      images: ['/placeholder.svg?height=400&width=600'],
      status: 'active',
    },
    {
      id: IDS.packages.luxury,
      title: 'Luxury Bush Escape — Samburu & Tsavo',
      description:
        'Remote northern Kenya meets wild Tsavo — fly-in camps, private guides, and sundowners overlooking untouched wilderness. The ultimate premium safari.',
      duration_days: 6,
      price: '320000.00',
      difficulty_level: 'easy',
      group_size_min: 2,
      group_size_max: 4,
      destinations: ['Samburu', 'Tsavo East & West'],
      highlights: [
        'Boutique fly-in camps',
        'Private guide & vehicle',
        'Bush dinners under stars',
        'Spa treatments available',
      ],
      included_services: [
        'All park & conservancy fees',
        '5 nights luxury camp',
        'Gourmet full board',
        'Domestic charter flights',
        'Laundry service',
      ],
      excluded_items: ['Premium spirits', 'Spa treatments', 'Gratuities'],
      images: ['/placeholder.svg?height=400&width=600'],
      status: 'active',
    },
  ]

  for (const pkg of packages) {
    await db.insert(schema.safariPackages).values(pkg).onConflictDoNothing()
  }
  console.log(`✓ ${packages.length} safari packages seeded`)
}

async function seedItineraries() {
  const itineraries = [
    // Classic Mara — 3 days
    {
      id: 'itin_mara_d1',
      package_id: IDS.packages.classicMara,
      day_number: 1,
      title: 'Nairobi to Maasai Mara',
      description: 'Depart Nairobi early, arrive Mara for afternoon game drive.',
      activities: ['Scenic drive via Great Rift Valley', 'Afternoon game drive'],
      meals: ['Lunch', 'Dinner'],
      accommodation: 'Mara Serena Lodge',
      distance_km: '280.00',
    },
    {
      id: 'itin_mara_d2',
      package_id: IDS.packages.classicMara,
      day_number: 2,
      title: 'Full Day in the Mara',
      description: 'Sunrise to sunset game drives across the reserve.',
      activities: ['Sunrise game drive', 'Bush breakfast', 'Afternoon drive'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Mara Serena Lodge',
    },
    {
      id: 'itin_mara_d3',
      package_id: IDS.packages.classicMara,
      day_number: 3,
      title: 'Final Drive & Return',
      description: 'Morning game drive then return to Nairobi.',
      activities: ['Morning game drive', 'Return transfer'],
      meals: ['Breakfast', 'Lunch'],
    },
    // Big Five — sample days
    {
      id: 'itin_bf_d1',
      package_id: IDS.packages.bigFive,
      day_number: 1,
      title: 'Arrive Maasai Mara',
      description: 'Transfer to Mara and evening predator tracking.',
      activities: ['Transfer', 'Evening game drive'],
      meals: ['Lunch', 'Dinner'],
      accommodation: 'Ashnil Mara Camp',
    },
    {
      id: 'itin_bf_d4',
      package_id: IDS.packages.bigFive,
      day_number: 4,
      title: 'Mara to Amboseli',
      description: 'Fly or drive to Amboseli for Kilimanjaro views.',
      activities: ['Transfer', 'Afternoon elephant viewing'],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Amboseli Serena',
      distance_km: '350.00',
    },
    // Photographer — Lake Nakuru day
    {
      id: 'itin_photo_d4',
      package_id: IDS.packages.photographer,
      day_number: 4,
      title: 'Lake Nakuru — Flamingos & Rhinos',
      description: 'Full day at the lake for birdlife and rhino photography.',
      activities: ['Hide session', 'Rhino tracking', 'Sunset shoot'],
      meals: ['Breakfast', 'Packed lunch', 'Dinner'],
      accommodation: 'Lake Nakuru Lodge',
    },
  ]

  for (const item of itineraries) {
    await db.insert(schema.itineraries).values(item).onConflictDoNothing()
  }
  console.log(`✓ ${itineraries.length} itinerary days seeded`)
}

async function seedDrivers() {
  await db
    .insert(schema.drivers)
    .values({
      id: IDS.drivers.james,
      userId: IDS.users.driver,
      license_number: 'DL-KEN-2018-44821',
      license_expiry: '2028-04-30',
      experience_years: 12,
      vehicle_id: IDS.vehicles.landCruiser1,
      status: 'available',
    })
    .onConflictDoNothing()

  console.log('✓ Driver profile seeded for driver@safari.test')
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add it to .env.local first.')
  }

  console.log('Seeding safari booking database...\n')

  await seedUsers()
  await seedDestinations()
  await seedVehicles()
  await seedPackages()
  await seedItineraries()
  await seedDrivers()

  console.log('\nDone! Run `npm run dev` and sign in with demo accounts above.')
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(() => pool.end())
