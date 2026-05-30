'use server'

import { db } from '@/lib/db'
import { bookings, drivers, payments, safariPackages, user, vehicles } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId, requireAdmin, requireDriver } from './auth'
import { nanoid } from 'nanoid'
import { createBookingSchema, formatZodError, updateBookingStatusSchema } from '@/lib/validations'
import type { BookingStatus } from '@/lib/booking-status'
import {
  notifyBookingCreated,
  notifyBookingConfirmed,
  notifyDriverAssigned,
} from '@/lib/email/notify'

function computeEndDate(startDate: string, durationDays: number): string {
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(start)
  end.setDate(end.getDate() + durationDays - 1)
  return end.toISOString().split('T')[0]
}

function computeTotalPrice(unitPrice: string, guests: number): string {
  return (parseFloat(unitPrice) * guests).toFixed(2)
}

const bookingWithPackageSelect = {
  id: bookings.id,
  userId: bookings.userId,
  package_id: bookings.package_id,
  driver_id: bookings.driver_id,
  start_date: bookings.start_date,
  end_date: bookings.end_date,
  number_of_guests: bookings.number_of_guests,
  total_price: bookings.total_price,
  status: bookings.status,
  special_requests: bookings.special_requests,
  created_at: bookings.created_at,
  updated_at: bookings.updated_at,
  package_title: safariPackages.title,
  package_duration_days: safariPackages.duration_days,
}

export type BookingWithPackage = {
  id: string
  userId: string
  package_id: string
  driver_id: string | null
  start_date: string
  end_date: string
  number_of_guests: number
  total_price: string
  status: string | null
  special_requests: string | null
  created_at: Date
  updated_at: Date
  package_title: string | null
  package_duration_days: number | null
}

export async function getUserBookings(): Promise<BookingWithPackage[]> {
  const userId = await getUserId()
  return await db
    .select(bookingWithPackageSelect)
    .from(bookings)
    .leftJoin(safariPackages, eq(bookings.package_id, safariPackages.id))
    .where(eq(bookings.userId, userId))
    .orderBy(desc(bookings.created_at))
}

export async function getBookingById(id: string): Promise<BookingWithPackage | null> {
  const userId = await getUserId()
  const result = await db
    .select(bookingWithPackageSelect)
    .from(bookings)
    .leftJoin(safariPackages, eq(bookings.package_id, safariPackages.id))
    .where(and(eq(bookings.id, id), eq(bookings.userId, userId)))

  return result[0] || null
}

export async function getBookingByIdForDriver(id: string): Promise<BookingWithPackage | null> {
  await requireDriver()
  const userId = await getUserId()
  const driver = await db
    .select()
    .from(drivers)
    .where(eq(drivers.userId, userId))

  if (!driver[0]) return null

  const result = await db
    .select(bookingWithPackageSelect)
    .from(bookings)
    .leftJoin(safariPackages, eq(bookings.package_id, safariPackages.id))
    .where(and(eq(bookings.id, id), eq(bookings.driver_id, driver[0].id)))

  return result[0] || null
}

export async function createBooking(data: {
  package_id: string
  start_date: string
  end_date: string
  number_of_guests: number
  special_requests?: string
}) {
  const userId = await getUserId()

  const parsed = createBookingSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  const input = parsed.data

  const pkg = await db
    .select()
    .from(safariPackages)
    .where(and(eq(safariPackages.id, input.package_id), eq(safariPackages.status, 'active')))

  if (!pkg[0]) {
    throw new Error('Package not found or is no longer available')
  }

  const packageData = pkg[0]
  const minGuests = packageData.group_size_min ?? 1
  const maxGuests = packageData.group_size_max ?? 50

  if (input.number_of_guests < minGuests || input.number_of_guests > maxGuests) {
    throw new Error(`Group size must be between ${minGuests} and ${maxGuests} guests`)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(`${input.start_date}T00:00:00`)
  if (start < today) {
    throw new Error('Start date cannot be in the past')
  }

  const expectedEnd = computeEndDate(input.start_date, packageData.duration_days)
  if (input.end_date !== expectedEnd) {
    throw new Error('Invalid trip dates for this package duration')
  }

  const totalPrice = computeTotalPrice(packageData.price, input.number_of_guests)

  const booking = await db
    .insert(bookings)
    .values({
      id: nanoid(),
      userId,
      package_id: input.package_id,
      start_date: input.start_date,
      end_date: input.end_date,
      number_of_guests: input.number_of_guests,
      total_price: totalPrice,
      special_requests: input.special_requests,
      status: 'pending',
    })
    .returning()

  notifyBookingCreated(booking[0]).catch(console.error)

  revalidatePath('/customer-dashboard')
  return booking[0]
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  await requireAdmin()

  const parsed = updateBookingStatusSchema.safeParse({ id, status })
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  const existing = await db.select().from(bookings).where(eq(bookings.id, id))
  if (!existing[0]) {
    throw new Error('Booking not found')
  }

  const current = existing[0].status ?? 'pending'

  if (status === 'confirmed' && current !== 'paid' && current !== 'confirmed') {
    throw new Error('Only paid bookings can be confirmed')
  }

  if (status === 'completed' && current !== 'confirmed') {
    throw new Error('Only confirmed bookings can be marked complete')
  }

  const updated = await db
    .update(bookings)
    .set({ status, updated_at: new Date() })
    .where(eq(bookings.id, id))
    .returning()

  if (status === 'confirmed') {
    notifyBookingConfirmed(updated[0]).catch(console.error)
  }

  revalidatePath('/admin/bookings')
  revalidatePath('/customer-dashboard')
  revalidatePath('/driver/dashboard')
  return updated[0]
}

export async function assignDriverToBooking(bookingId: string, driverId: string) {
  await requireAdmin()

  const existing = await db.select().from(bookings).where(eq(bookings.id, bookingId))
  if (!existing[0]) {
    throw new Error('Booking not found')
  }

  if (existing[0].status !== 'confirmed' && existing[0].status !== 'completed') {
    throw new Error('Driver can only be assigned to confirmed bookings')
  }

  const driver = await db.select().from(drivers).where(eq(drivers.id, driverId))
  if (!driver[0]) {
    throw new Error('Driver not found')
  }

  const updated = await db
    .update(bookings)
    .set({ driver_id: driverId, updated_at: new Date() })
    .where(eq(bookings.id, bookingId))
    .returning()

  notifyDriverAssigned(updated[0], driver[0].userId).catch(console.error)

  revalidatePath('/admin/bookings')
  revalidatePath('/driver/dashboard')
  return updated[0]
}

export async function getAllBookings(): Promise<BookingWithPackage[]> {
  await requireAdmin()
  return await db
    .select(bookingWithPackageSelect)
    .from(bookings)
    .leftJoin(safariPackages, eq(bookings.package_id, safariPackages.id))
    .orderBy(desc(bookings.created_at))
}

export async function getDriverBookings(): Promise<BookingWithPackage[]> {
  await requireDriver()
  const userId = await getUserId()

  const driver = await db
    .select()
    .from(drivers)
    .where(eq(drivers.userId, userId))

  if (!driver[0]) return []

  return await db
    .select(bookingWithPackageSelect)
    .from(bookings)
    .leftJoin(safariPackages, eq(bookings.package_id, safariPackages.id))
    .where(eq(bookings.driver_id, driver[0].id))
    .orderBy(desc(bookings.start_date))
}

export async function getBookingWithPayment(id: string) {
  const userId = await getUserId()
  const bookingRows = await db
    .select(bookingWithPackageSelect)
    .from(bookings)
    .leftJoin(safariPackages, eq(bookings.package_id, safariPackages.id))
    .where(and(eq(bookings.id, id), eq(bookings.userId, userId)))

  if (!bookingRows[0]) return null

  const payment = await db
    .select()
    .from(payments)
    .where(eq(payments.booking_id, id))
    .orderBy(desc(payments.created_at))

  return { booking: bookingRows[0], payment: payment[0] ?? null }
}

export async function getBookingDriverAssignment(bookingId: string) {
  const userId = await getUserId()

  const booking = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, userId)))

  if (!booking[0]?.driver_id) return null

  const rows = await db
    .select({
      driverName: user.name,
      driverEmail: user.email,
      license_number: drivers.license_number,
      experience_years: drivers.experience_years,
      vehicle_id: drivers.vehicle_id,
    })
    .from(drivers)
    .innerJoin(user, eq(drivers.userId, user.id))
    .where(eq(drivers.id, booking[0].driver_id))

  if (!rows[0]) return null

  let vehicle: { make_model: string; registration_number: string; vehicle_type: string } | null = null
  if (rows[0].vehicle_id) {
    const v = await db.select().from(vehicles).where(eq(vehicles.id, rows[0].vehicle_id))
    vehicle = v[0]
      ? {
          make_model: v[0].make_model,
          registration_number: v[0].registration_number,
          vehicle_type: v[0].vehicle_type,
        }
      : null
  }

  return { ...rows[0], vehicle }
}

export async function getBookingCustomerForDriver(bookingId: string) {
  await requireDriver()
  const driverUserId = await getUserId()

  const driver = await db.select().from(drivers).where(eq(drivers.userId, driverUserId))
  if (!driver[0]) return null

  const booking = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, bookingId), eq(bookings.driver_id, driver[0].id)))

  if (!booking[0]) return null

  const customer = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, booking[0].userId))

  return customer[0] ?? null
}
