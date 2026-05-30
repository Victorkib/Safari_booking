'use server'

import { db } from '@/lib/db'
import { drivers, user } from '@/lib/db/schema'
import { eq, and, notInArray } from 'drizzle-orm'
import { requireAdmin } from './auth'

/** Users with driver role who do not yet have a driver profile */
export async function getEligibleDriverUsers() {
  await requireAdmin()

  const existingDriverUserIds = await db.select({ userId: drivers.userId }).from(drivers)
  const takenIds = existingDriverUserIds.map((d) => d.userId)

  if (takenIds.length === 0) {
    return await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.role, 'driver'))
  }

  return await db
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .where(and(eq(user.role, 'driver'), notInArray(user.id, takenIds)))
}
