'use server'

import { getUserId } from './auth'
import { db } from '@/lib/db'
import { payments } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { getMpesaConfig, queryStkPushStatus } from '@/lib/mpesa'
import { applyPaymentStatusChange } from '@/lib/payments/transitions'

export async function getMpesaPaymentStatus(bookingId: string) {
  const userId = await getUserId()

  const rows = await db
    .select()
    .from(payments)
    .where(and(eq(payments.booking_id, bookingId), eq(payments.userId, userId)))
    .orderBy(desc(payments.created_at))

  const latest = rows[0]
  if (!latest) {
    return { status: 'not_found' as const }
  }

  const config = getMpesaConfig()

  if (
    latest.payment_method === 'mpesa' &&
    latest.status === 'pending' &&
    latest.transaction_id &&
    config
  ) {
    try {
      const query = await queryStkPushStatus(config, latest.transaction_id)

      if (query.resultCode === '0') {
        await applyPaymentStatusChange(latest.id, 'completed')
        return { status: 'completed' as const, paymentId: latest.id }
      }

      const cancelled =
        query.resultCode === '1032' ||
        query.resultDesc.toLowerCase().includes('cancel')

      if (!cancelled && query.resultCode !== '1032' && query.resultCode !== '4999') {
        const failedCodes = ['1', '26', '2001']
        if (failedCodes.includes(query.resultCode)) {
          await applyPaymentStatusChange(latest.id, 'failed')
          return { status: 'failed' as const, paymentId: latest.id, message: query.resultDesc }
        }
      }
    } catch {
      // Daraja query can lag — callback may still arrive
    }
  }

  return {
    status: (latest.status ?? 'pending') as 'pending' | 'completed' | 'failed' | 'refunded',
    paymentId: latest.id,
    mpesaReceipt: latest.mpesa_receipt,
    checkoutRequestId: latest.transaction_id,
    mpesaPhone: latest.mpesa_phone,
  }
}
