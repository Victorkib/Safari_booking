import { db } from '@/lib/db'
import { bookings, payments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import type { PaymentStatus } from '@/lib/booking-status'
import { notifyBookingConfirmed, notifyPaymentFailed } from '@/lib/email/notify'

export async function applyPaymentStatusChange(
  paymentId: string,
  status: PaymentStatus,
  opts?: { mpesaReceipt?: string }
) {
  const existing = await db.select().from(payments).where(eq(payments.id, paymentId))
  if (!existing[0]) {
    throw new Error('Payment not found')
  }

  const payment = existing[0]

  if (payment.status === status) {
    return payment
  }

  if (payment.status === 'completed' && status !== 'refunded') {
    return payment
  }

  const result = await db.transaction(async (tx) => {
    const [updatedPayment] = await tx
      .update(payments)
      .set({
        status,
        mpesa_receipt: opts?.mpesaReceipt ?? payment.mpesa_receipt,
        updated_at: new Date(),
      })
      .where(eq(payments.id, paymentId))
      .returning()

    if (status === 'completed') {
      await tx
        .update(bookings)
        .set({ status: 'confirmed', updated_at: new Date() })
        .where(eq(bookings.id, payment.booking_id))
    } else if (status === 'failed' || status === 'refunded') {
      await tx
        .update(bookings)
        .set({ status: 'pending', updated_at: new Date() })
        .where(eq(bookings.id, payment.booking_id))
    }

    return updatedPayment
  })

  const bookingRow = await db.select().from(bookings).where(eq(bookings.id, payment.booking_id))

  if (bookingRow[0]) {
    if (status === 'completed') {
      notifyBookingConfirmed(bookingRow[0]).catch(console.error)
    } else if (status === 'failed' || status === 'refunded') {
      notifyPaymentFailed(bookingRow[0]).catch(console.error)
    }
  }

  revalidatePath('/admin/payments')
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/dashboard')
  revalidatePath('/customer-dashboard')
  revalidatePath(`/booking/${payment.booking_id}`)

  return result
}

export async function findPaymentByCheckoutRequestId(checkoutRequestId: string) {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.transaction_id, checkoutRequestId))

  return rows[0] ?? null
}
