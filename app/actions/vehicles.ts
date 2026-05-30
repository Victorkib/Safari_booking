'use server'

import { db } from '@/lib/db'
import { vehicles } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from './auth'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function getAllVehicles() {
  await requireAdmin()
  return await db
    .select()
    .from(vehicles)
    .orderBy(desc(vehicles.created_at))
}

export async function getVehicleById(id: string) {
  const result = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
  return result[0] || null
}

export async function createVehicle(data: {
  registration_number: string
  vehicle_type: string
  make_model: string
  seating_capacity: number
  license_expiry?: string
  insurance_expiry?: string
}) {
  await requireAdmin()

  const vehicle = await db
    .insert(vehicles)
    .values({
      id: nanoid(),
      ...data,
      status: 'active',
    })
    .returning()

  revalidatePath('/admin/vehicles')
  return vehicle[0]
}
