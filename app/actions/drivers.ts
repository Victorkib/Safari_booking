'use server'

import { db } from '@/lib/db'
import { drivers, user } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin, requireDriver, getUserId } from './auth'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export type DriverRow = {
  id: string
  userId: string
  license_number: string
  license_expiry: string
  experience_years: number | null
  vehicle_id: string | null
  status: string | null
  name: string
  email: string
}

export async function getAllDrivers(): Promise<DriverRow[]> {
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

export async function getDriverById(id: string) {
  await requireAdmin()
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
    .where(eq(drivers.id, id))

  return result[0] || null
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
  status?: string
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
      vehicle_id: data.vehicle_id || null,
      status: data.status ?? 'available',
    })
    .returning()

  revalidatePath('/admin/drivers')
  return driver[0]
}

export async function updateDriver(
  id: string,
  data: {
    license_number: string
    license_expiry: string
    experience_years?: number
    vehicle_id?: string | null
    status?: string
  }
) {
  await requireAdmin()

  const updated = await db
    .update(drivers)
    .set({
      license_number: data.license_number,
      license_expiry: data.license_expiry,
      experience_years: data.experience_years,
      vehicle_id: data.vehicle_id || null,
      status: data.status ?? 'available',
      updated_at: new Date(),
    })
    .where(eq(drivers.id, id))
    .returning()

  if (!updated[0]) {
    throw new Error('Driver not found')
  }

  revalidatePath('/admin/drivers')
  revalidatePath(`/admin/drivers/${id}/edit`)
  return updated[0]
}

export async function deleteDriver(id: string) {
  await requireAdmin()

  const deleted = await db.delete(drivers).where(eq(drivers.id, id)).returning()
  if (!deleted[0]) {
    throw new Error('Driver not found')
  }

  revalidatePath('/admin/drivers')
  return deleted[0]
}
