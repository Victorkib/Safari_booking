'use server'

import { db } from '@/lib/db'
import { bookings, drivers } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId, requireAdmin, requireDriver } from './auth'
import { nanoid } from 'nanoid'

export async function getUserBookings() {
  const userId = await getUserId()
  return await db
    .select()
    .from(bookings)
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.created_at))
}

export async function getBookingById(id: string) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.userId, userId)))

  return result[0] || null
}

export async function getBookingByIdForDriver(id: string) {
  await requireDriver()
  const userId = await getUserId()
  const driver = await db
    .select()
    .from(drivers)
    .where(eq(drivers.userId, userId))

  if (!driver[0]) return null

  const result = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, id), eq(bookings.driver_id, driver[0].id)))

  return result[0] || null
}

export async function createBooking(data: {
  package_id: string
  start_date: string
  end_date: string
  number_of_guests: number
  total_price: string
  special_requests?: string
}) {
  const userId = await getUserId()

  const booking = await db
    .insert(bookings)
    .values({
      id: nanoid(),
      userId,
      package_id: data.package_id,
      start_date: data.start_date,
      end_date: data.end_date,
      number_of_guests: data.number_of_guests,
      total_price: data.total_price,
      special_requests: data.special_requests,
      status: 'pending',
    })
    .returning()

  revalidatePath('/customer-dashboard')
  return booking[0]
}

export async function updateBookingStatus(
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
) {
  await requireAdmin()

  const updated = await db
    .update(bookings)
    .set({ status, updated_at: new Date() })
    .where(eq(bookings.id, id))
    .returning()

  revalidatePath('/admin/bookings')
  revalidatePath('/customer-dashboard')
  return updated[0]
}

export async function assignDriverToBooking(bookingId: string, driverId: string) {
  await requireAdmin()

  const updated = await db
    .update(bookings)
    .set({ driver_id: driverId, updated_at: new Date() })
    .where(eq(bookings.id, bookingId))
    .returning()

  revalidatePath('/admin/bookings')
  revalidatePath('/driver/dashboard')
  return updated[0]
}

export async function getAllBookings() {
  await requireAdmin()
  return await db
    .select()
    .from(bookings)
    .orderBy(desc(bookings.created_at))
}

export async function getDriverBookings() {
  await requireDriver()
  const userId = await getUserId()

  const driver = await db
    .select()
    .from(drivers)
    .where(eq(drivers.userId, userId))

  if (!driver[0]) return []

  return await db
    .select()
    .from(bookings)
    .where(eq(bookings.driver_id, driver[0].id))
    .orderBy(desc(bookings.start_date))
}
