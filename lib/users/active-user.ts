import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'

export async function getUserRowById(id: string) {
  const rows = await db
    .select()
    .from(user)
    .where(and(eq(user.id, id), isNull(user.deletedAt)))
  return rows[0] ?? null
}

export async function assertUserIsActive(userId: string) {
  const row = await getUserRowById(userId)
  if (!row) {
    throw new Error('Account not found or has been deactivated')
  }
  return row
}
