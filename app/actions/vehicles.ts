'use server'

import { db } from '@/lib/db'
import { vehicles } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from './auth'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export type VehicleInput = {
  registration_number: string
  vehicle_type: string
  make_model: string
  seating_capacity: number
  license_expiry?: string
  insurance_expiry?: string
  status?: string
}

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

export async function createVehicle(data: VehicleInput) {
  await requireAdmin()

  const vehicle = await db
    .insert(vehicles)
    .values({
      id: nanoid(),
      registration_number: data.registration_number,
      vehicle_type: data.vehicle_type,
      make_model: data.make_model,
      seating_capacity: data.seating_capacity,
      license_expiry: data.license_expiry,
      insurance_expiry: data.insurance_expiry,
      status: data.status ?? 'active',
    })
    .returning()

  revalidatePath('/admin/vehicles')
  return vehicle[0]
}

export async function updateVehicle(id: string, data: VehicleInput) {
  await requireAdmin()

  const updated = await db
    .update(vehicles)
    .set({
      registration_number: data.registration_number,
      vehicle_type: data.vehicle_type,
      make_model: data.make_model,
      seating_capacity: data.seating_capacity,
      license_expiry: data.license_expiry,
      insurance_expiry: data.insurance_expiry,
      status: data.status ?? 'active',
      updated_at: new Date(),
    })
    .where(eq(vehicles.id, id))
    .returning()

  if (!updated[0]) {
    throw new Error('Vehicle not found')
  }

  revalidatePath('/admin/vehicles')
  revalidatePath(`/admin/vehicles/${id}/edit`)
  return updated[0]
}

export async function deleteVehicle(id: string) {
  await requireAdmin()

  const deleted = await db.delete(vehicles).where(eq(vehicles.id, id)).returning()
  if (!deleted[0]) {
    throw new Error('Vehicle not found')
  }

  revalidatePath('/admin/vehicles')
  return deleted[0]
}
