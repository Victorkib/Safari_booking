/**
 * Permanently removes users soft-deleted 7+ days ago (and related auth rows).
 * Run via cron: npm run db:purge-deleted
 */
import { config } from 'dotenv'
import { and, eq, isNotNull, lt } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

config({ path: '.env.local' })

const RETENTION_DAYS = 7

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  const db = drizzle(pool, { schema })

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS)

  const toPurge = await db
    .select({ id: schema.user.id, email: schema.user.email })
    .from(schema.user)
    .where(
      and(isNotNull(schema.user.deletedAt), lt(schema.user.deletedAt, cutoff))
    )

  if (toPurge.length === 0) {
    console.log('No soft-deleted users ready for permanent purge.')
    await pool.end()
    return
  }

  for (const u of toPurge) {
    await db.delete(schema.session).where(eq(schema.session.userId, u.id))
    await db.delete(schema.account).where(eq(schema.account.userId, u.id))
    await db.delete(schema.user).where(eq(schema.user.id, u.id))
    console.log(`Purged user ${u.email} (${u.id})`)
  }

  console.log(`Permanently removed ${toPurge.length} user(s).`)
  await pool.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
