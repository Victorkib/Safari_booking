import { config } from 'dotenv'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

config({ path: '.env.local' })

const TABLES_IN_ORDER = [
  'payments',
  'reviews',
  'analytics',
  'bookings',
  'quotations',
  'itineraries',
  'drivers',
  'vehicles',
  'safari_packages',
  'destinations',
  'session',
  'account',
  'verification',
  'user',
] as const

function assertClearAllowed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.CONFIRM_DB_CLEAR !== 'yes') {
      throw new Error(
        'Refusing to clear production database. Set CONFIRM_DB_CLEAR=yes to proceed.'
      )
    }
  }
}

export async function clearAllData(pool: Pool) {
  assertClearAllowed()
  const db = drizzle(pool)

  for (const table of TABLES_IN_ORDER) {
    await db.execute(sql.raw(`DELETE FROM "${table}"`))
  }
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  try {
    console.log('Clearing all application data...')
    await clearAllData(pool)
    console.log('Database cleared successfully.')
  } finally {
    await pool.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
