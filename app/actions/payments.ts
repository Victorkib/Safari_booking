'use server'

import { db } from '@/lib/db'
import { payments } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId, requireAdmin } from './auth'
import { nanoid } from 'nanoid'

export async function getUserPayments() {
  const userId = await getUserId()
  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.created_at))
}

export async function getPaymentByBookingId(booking_id: string) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.booking_id, booking_id),
        eq(payments.userId, userId)
      )
    )

  return result[0] || null
}

export async function createPayment(data: {
  booking_id: string
  amount: string
  payment_method: 'mpesa' | 'stripe' | 'bank_transfer'
  transaction_id?: string
  mpesa_receipt?: string
}) {
  const userId = await getUserId()

  const payment = await db
    .insert(payments)
    .values({
      id: nanoid(),
      booking_id: data.booking_id,
      userId,
      amount: data.amount,
      payment_method: data.payment_method,
      transaction_id: data.transaction_id,
      mpesa_receipt: data.mpesa_receipt,
      status: 'pending',
    })
    .returning()

  revalidatePath('/customer-dashboard')
  return payment[0]
}

export async function updatePaymentStatus(
  id: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded'
) {
  const userId = await getUserId()

  const updated = await db
    .update(payments)
    .set({ status, updated_at: new Date() })
    .where(and(eq(payments.id, id), eq(payments.userId, userId)))
    .returning()

  revalidatePath('/customer-dashboard')
  return updated[0]
}

export async function adminUpdatePaymentStatus(
  id: string,
  status: 'pending' | 'completed' | 'failed' | 'refunded'
) {
  await requireAdmin()

  const updated = await db
    .update(payments)
    .set({ status, updated_at: new Date() })
    .where(eq(payments.id, id))
    .returning()

  revalidatePath('/admin/payments')
  return updated[0]
}

export async function getAllPayments() {
  await requireAdmin()
  return await db
    .select()
    .from(payments)
    .orderBy(desc(payments.created_at))
}
