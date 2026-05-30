import { db } from '@/lib/db'
import { safariPackages, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import {
  bookingConfirmedEmail,
  bookingCreatedEmail,
  driverAssignedEmail,
  paymentFailedEmail,
  paymentSubmittedAdminEmail,
  paymentSubmittedCustomerEmail,
} from './templates'
import { sendAdminEmailSafe, sendEmailSafe } from './send'

type BookingRow = {
  id: string
  userId: string
  package_id: string
  start_date: string
  end_date: string
  number_of_guests: number
  total_price: string
}

async function getEmailContext(booking: BookingRow) {
  const [customer, pkg] = await Promise.all([
    db.select({ name: user.name, email: user.email }).from(user).where(eq(user.id, booking.userId)),
    db
      .select({ title: safariPackages.title })
      .from(safariPackages)
      .where(eq(safariPackages.id, booking.package_id)),
  ])

  return {
    customerName: customer[0]?.name ?? 'Guest',
    customerEmail: customer[0]?.email,
    packageTitle: pkg[0]?.title ?? 'Safari Package',
    bookingId: booking.id,
    startDate: booking.start_date,
    endDate: booking.end_date,
    guests: booking.number_of_guests,
    totalPrice: booking.total_price,
  }
}

export async function notifyBookingCreated(booking: BookingRow): Promise<void> {
  const ctx = await getEmailContext(booking)
  if (!ctx.customerEmail) return

  const { subject, html } = bookingCreatedEmail(ctx)
  sendEmailSafe({ to: ctx.customerEmail, subject, html })
}

export async function notifyPaymentSubmitted(
  booking: BookingRow,
  transactionId?: string | null
): Promise<void> {
  const ctx = await getEmailContext(booking)
  if (!ctx.customerEmail) return

  const customerMail = paymentSubmittedCustomerEmail({ ...ctx, transactionId: transactionId ?? undefined })
  sendEmailSafe({ to: ctx.customerEmail, subject: customerMail.subject, html: customerMail.html })

  const adminMail = paymentSubmittedAdminEmail({ ...ctx, transactionId: transactionId ?? undefined })
  sendAdminEmailSafe({ subject: adminMail.subject, html: adminMail.html })
}

export async function notifyBookingConfirmed(booking: BookingRow): Promise<void> {
  const ctx = await getEmailContext(booking)
  if (!ctx.customerEmail) return

  const { subject, html } = bookingConfirmedEmail(ctx)
  sendEmailSafe({ to: ctx.customerEmail, subject, html })
}

export async function notifyPaymentFailed(booking: BookingRow): Promise<void> {
  const ctx = await getEmailContext(booking)
  if (!ctx.customerEmail) return

  const { subject, html } = paymentFailedEmail(ctx)
  sendEmailSafe({ to: ctx.customerEmail, subject, html })
}

export async function notifyDriverAssigned(
  booking: BookingRow,
  driverUserId: string
): Promise<void> {
  const ctx = await getEmailContext(booking)
  const driver = await db
    .select({ name: user.name, email: user.email })
    .from(user)
    .where(eq(user.id, driverUserId))

  if (!driver[0]?.email) return

  const { subject, html } = driverAssignedEmail({
    driverName: driver[0].name,
    packageTitle: ctx.packageTitle,
    bookingId: booking.id,
    startDate: booking.start_date,
    endDate: booking.end_date,
    guests: booking.number_of_guests,
  })

  sendEmailSafe({ to: driver[0].email, subject, html })
}
