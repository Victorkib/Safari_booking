'use server'

import { db } from '@/lib/db'
import { drivers, vehicles, user } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin, requireDriver, getUserId } from './auth'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function getAllDrivers() {
  await requireAdmin()
  return await db
    .select({
      id: drivers.id,
      userId: drivers.userId,
      license_number: drivers.license_number,
      license_expiry: drivers.license_expiry,
      experience_years: drivers.experience_years,
      vehicle_id: drivers.vehicle_id,
      status: drivers.status,
      name: user.name,
      email: user.email,
    })
    .from(drivers)
    .innerJoin(user, eq(drivers.userId, user.id))
    .orderBy(desc(drivers.created_at))
}

export async function getDriverProfile() {
  await requireDriver()
  const userId = await getUserId()

  const result = await db
    .select({
      id: drivers.id,
      userId: drivers.userId,
      license_number: drivers.license_number,
      license_expiry: drivers.license_expiry,
      experience_years: drivers.experience_years,
      vehicle_id: drivers.vehicle_id,
      status: drivers.status,
      name: user.name,
      email: user.email,
    })
    .from(drivers)
    .innerJoin(user, eq(drivers.userId, user.id))
    .where(eq(drivers.userId, userId))

  return result[0] || null
}

export async function createDriver(data: {
  userId: string
  license_number: string
  license_expiry: string
  experience_years?: number
  vehicle_id?: string
}) {
  await requireAdmin()

  const driver = await db
    .insert(drivers)
    .values({
      id: nanoid(),
      userId: data.userId,
      license_number: data.license_number,
      license_expiry: data.license_expiry,
      experience_years: data.experience_years,
      vehicle_id: data.vehicle_id,
      status: 'available',
    })
    .returning()

  revalidatePath('/admin/drivers')
  return driver[0]
}
