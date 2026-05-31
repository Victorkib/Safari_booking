'use server'

import { db } from '@/lib/db'
import { bookings, payments } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getUserId, requireAdmin, requireCustomer } from './auth'
import { getUserRowById } from '@/lib/users/active-user'
import { nanoid } from 'nanoid'
import {
  adminPaymentStatusSchema,
  adminRecordPaymentSchema,
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
  await requireCustomer()
  const userId = await getUserId()
  return await db
    .select()
    .from(payments)
    .where(eq(payments.userId, userId))
    .orderBy(desc(payments.created_at))
}

export async function getPaymentByBookingId(booking_id: string) {
  await requireCustomer()
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
  await requireCustomer()
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
  await requireCustomer()
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

export async function getPaymentsForBookingAdmin(bookingId: string) {
  await requireAdmin()
  return await db
    .select()
    .from(payments)
    .where(eq(payments.booking_id, bookingId))
    .orderBy(desc(payments.created_at))
}

/** Admin records payment on behalf of customer (cash, bank, manual M-Pesa, or STK to customer phone). */
export async function adminRecordPayment(data: {
  booking_id: string
  method: 'cash' | 'bank_transfer' | 'mpesa_manual' | 'mpesa_stk'
  mpesa_phone?: string
  transaction_id?: string
  mpesa_receipt?: string
  notes?: string
}): Promise<CreatePaymentResult> {
  await requireAdmin()

  const parsed = adminRecordPaymentSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  const input = parsed.data

  const booking = await db.select().from(bookings).where(eq(bookings.id, input.booking_id))
  if (!booking[0]) {
    throw new Error('Booking not found')
  }

  if (booking[0].status !== 'pending') {
    throw new Error('This booking is not awaiting payment')
  }

  const customer = await getUserRowById(booking[0].userId)
  if (!customer || customer.role !== 'customer') {
    throw new Error('Booking must belong to an active customer account')
  }

  const existingPending = await db
    .select()
    .from(payments)
    .where(
      and(eq(payments.booking_id, input.booking_id), eq(payments.status, 'pending'))
    )

  if (existingPending[0]) {
    throw new Error('A payment is already pending for this booking')
  }

  const amount = booking[0].total_price
  const customerUserId = booking[0].userId
  const noteRef = input.notes ? ` — ${input.notes}` : ''

  if (input.method === 'mpesa_stk') {
    if (!input.mpesa_phone) {
      throw new Error('M-Pesa phone number is required for STK Push')
    }
    if (!isMpesaConfigured()) {
      throw new Error('M-Pesa is not configured. Use manual recording instead.')
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
          userId: customerUserId,
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

  const paymentMethod =
    input.method === 'cash'
      ? 'cash'
      : input.method === 'bank_transfer'
        ? 'bank_transfer'
        : 'mpesa'

  let transactionId = input.transaction_id
  if (input.method === 'cash') {
    transactionId = transactionId ?? `CASH-${Date.now()}${noteRef}`
  } else if (input.method === 'bank_transfer') {
    transactionId = transactionId ?? `BANK-${Date.now()}${noteRef}`
  } else {
    if (!input.mpesa_phone) {
      throw new Error('M-Pesa phone is required for manual M-Pesa recording')
    }
    transactionId = transactionId ?? `MPESA-MANUAL-${Date.now()}`
  }

  const mpesaPhone =
    input.method === 'mpesa_manual' && input.mpesa_phone
      ? normalizeKenyanPhone(input.mpesa_phone)
      : undefined

  const markCompletedImmediately = input.method === 'cash' || input.method === 'bank_transfer'

  const result = await db.transaction(async (tx) => {
    const [payment] = await tx
      .insert(payments)
      .values({
        id: nanoid(),
        booking_id: input.booking_id,
        userId: customerUserId,
        amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        mpesa_receipt: input.mpesa_receipt,
        mpesa_phone: mpesaPhone,
        status: markCompletedImmediately ? 'completed' : 'pending',
      })
      .returning()

    await tx
      .update(bookings)
      .set({
        status: markCompletedImmediately ? 'confirmed' : 'paid',
        updated_at: new Date(),
      })
      .where(eq(bookings.id, input.booking_id))

    return payment
  })

  if (!markCompletedImmediately) {
    notifyPaymentSubmitted(booking[0], result.transaction_id).catch(console.error)
  } else {
    const { notifyBookingConfirmed } = await import('@/lib/email/notify')
    notifyBookingConfirmed(booking[0]).catch(console.error)
  }

  revalidatePaths(input.booking_id)
  revalidatePath(`/admin/bookings/${input.booking_id}`)

  return result
}
