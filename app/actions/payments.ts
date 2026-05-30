'use server'

import { db } from '@/lib/db'
import { bookings, payments } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId, requireAdmin } from './auth'
import { nanoid } from 'nanoid'
import {
  adminPaymentStatusSchema,
  createPaymentSchema,
  formatZodError,
} from '@/lib/validations'
import type { PaymentStatus } from '@/lib/booking-status'
import { notifyPaymentSubmitted } from '@/lib/email/notify'
import { getMpesaConfig, initiateStkPush, isMpesaConfigured, normalizeKenyanPhone } from '@/lib/mpesa'
import { applyPaymentStatusChange } from '@/lib/payments/transitions'

export type CreatePaymentResult = {
  id: string
  booking_id: string
  status: string | null
  payment_method: string | null
  transaction_id: string | null
  mpesaStk?: boolean
  customerMessage?: string
}

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
    .orderBy(desc(payments.created_at))

  return result[0] || null
}

export async function createPayment(data: {
  booking_id: string
  payment_method: 'mpesa' | 'stripe' | 'bank_transfer'
  transaction_id?: string
  mpesa_receipt?: string
  mpesa_phone?: string
}): Promise<CreatePaymentResult> {
  const userId = await getUserId()

  const parsed = createPaymentSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  const input = parsed.data

  const booking = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.id, input.booking_id), eq(bookings.userId, userId)))

  if (!booking[0]) {
    throw new Error('Booking not found')
  }

  if (booking[0].status !== 'pending') {
    throw new Error('This booking is not awaiting payment')
  }

  const existingPending = await db
    .select()
    .from(payments)
    .where(
      and(
        eq(payments.booking_id, input.booking_id),
        eq(payments.status, 'pending')
      )
    )

  if (existingPending[0]) {
    throw new Error('A payment is already pending for this booking')
  }

  const amount = booking[0].total_price

  if (input.payment_method === 'mpesa' && isMpesaConfigured()) {
    if (!input.mpesa_phone) {
      throw new Error('M-Pesa phone number is required')
    }

    const phone = normalizeKenyanPhone(input.mpesa_phone)
    const config = getMpesaConfig()!
    const kesAmount = Math.ceil(parseFloat(amount))

    const stk = await initiateStkPush(config, {
      phone,
      amount: kesAmount,
      accountReference: input.booking_id,
      transactionDesc: 'Safari booking',
    })

    const result = await db.transaction(async (tx) => {
      const [payment] = await tx
        .insert(payments)
        .values({
          id: nanoid(),
          booking_id: input.booking_id,
          userId,
          amount,
          payment_method: 'mpesa',
          transaction_id: stk.checkoutRequestId,
          mpesa_phone: phone,
          status: 'pending',
        })
        .returning()

      await tx
        .update(bookings)
        .set({ status: 'paid', updated_at: new Date() })
        .where(eq(bookings.id, input.booking_id))

      return payment
    })

    revalidatePaths(input.booking_id)
    notifyPaymentSubmitted(booking[0], stk.checkoutRequestId).catch(console.error)

    return {
      ...result,
      mpesaStk: true,
      customerMessage: stk.customerMessage,
    }
  }

  let transactionId = input.transaction_id
  const mpesaReceipt = input.mpesa_receipt
  let mpesaPhone: string | undefined

  if (input.payment_method === 'mpesa') {
    if (!input.mpesa_phone) {
      throw new Error('M-Pesa phone number is required')
    }
    mpesaPhone = normalizeKenyanPhone(input.mpesa_phone)
    transactionId = transactionId ?? `MPESA-MANUAL-${Date.now()}`
  } else if (input.payment_method === 'bank_transfer') {
    transactionId = transactionId ?? `BANK-PENDING-${Date.now()}`
  } else {
    transactionId = transactionId ?? `CARD-PENDING-${Date.now()}`
  }

  const result = await db.transaction(async (tx) => {
    const [payment] = await tx
      .insert(payments)
      .values({
        id: nanoid(),
        booking_id: input.booking_id,
        userId,
        amount,
        payment_method: input.payment_method,
        transaction_id: transactionId,
        mpesa_receipt: mpesaReceipt,
        mpesa_phone: mpesaPhone,
        status: 'pending',
      })
      .returning()

    await tx
      .update(bookings)
      .set({ status: 'paid', updated_at: new Date() })
      .where(eq(bookings.id, input.booking_id))

    return payment
  })

  revalidatePaths(input.booking_id)
  notifyPaymentSubmitted(booking[0], result.transaction_id).catch(console.error)

  return result
}

function revalidatePaths(bookingId: string) {
  revalidatePath('/customer-dashboard')
  revalidatePath(`/booking/${bookingId}`)
  revalidatePath('/admin/payments')
}

/** Customers cannot mark payments complete — admin verification only. */
export async function updatePaymentStatus(
  id: string,
  status: PaymentStatus
) {
  const userId = await getUserId()

  if (status === 'completed') {
    throw new Error('Payment verification is handled by our team')
  }

  const updated = await db
    .update(payments)
    .set({ status, updated_at: new Date() })
    .where(and(eq(payments.id, id), eq(payments.userId, userId)))
    .returning()

  if (!updated[0]) {
    throw new Error('Payment not found')
  }

  revalidatePath('/customer-dashboard')
  return updated[0]
}

export async function adminUpdatePaymentStatus(
  id: string,
  status: PaymentStatus
) {
  await requireAdmin()

  const parsed = adminPaymentStatusSchema.safeParse({ id, status })
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  return applyPaymentStatusChange(id, status)
}

export async function getAllPayments() {
  await requireAdmin()
  return await db
    .select()
    .from(payments)
    .orderBy(desc(payments.created_at))
}

export async function getLatestPaymentForBooking(bookingId: string) {
  const userId = await getUserId()
  const result = await db
    .select()
    .from(payments)
    .where(and(eq(payments.booking_id, bookingId), eq(payments.userId, userId)))
    .orderBy(desc(payments.created_at))

  return result[0] ?? null
}

export async function isMpesaLive(): Promise<boolean> {
  return isMpesaConfigured()
}
