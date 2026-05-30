import {
  getBookingWithPayment,
  getBookingDriverAssignment,
} from '@/app/actions/bookings'
import { getUserId } from '@/app/actions/auth'
import { isMpesaLive } from '@/app/actions/payments'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'
import { MpesaPaymentPoller } from '@/components/mpesa-payment-poller'
import { DriverAssignmentCard } from '@/components/safari/driver-assignment-card'
import { CheckCircle2, Clock, PartyPopper } from 'lucide-react'

interface SuccessPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ stk?: string }>
}

export default async function PaymentSuccess({ params, searchParams }: SuccessPageProps) {
  const { id } = await params
  const { stk } = await searchParams
  const userId = await getUserId().catch(() => null)

  if (!userId) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/booking/${id}/success`)}`)
  }

  const data = await getBookingWithPayment(id)
  const mpesaLive = await isMpesaLive()

  if (!data) {
    notFound()
  }

  const { booking, payment } = data

  if (booking.status === 'pending') {
    redirect(`/booking/${id}/payment`)
  }

  const isConfirmed = booking.status === 'confirmed' || booking.status === 'completed'
  const isMpesaPending =
    payment?.payment_method === 'mpesa' &&
    payment.status === 'pending' &&
    mpesaLive &&
    stk === '1'

  const isMpesaConfirmed =
    payment?.payment_method === 'mpesa' && payment.status === 'completed' && payment.mpesa_receipt

  const driverAssignment = isConfirmed ? await getBookingDriverAssignment(id) : null

  const StatusIcon = isConfirmed ? PartyPopper : isMpesaPending ? Clock : CheckCircle2

  return (
    <>
      <div className="mb-8 flex flex-col items-center text-center">
        <div
          className={`mb-4 flex size-16 items-center justify-center rounded-full ${
            isConfirmed
              ? 'bg-secondary/20 text-secondary'
              : isMpesaPending
                ? 'bg-amber-100 text-amber-700'
                : 'bg-primary/10 text-primary'
          }`}
        >
          <StatusIcon className="size-8" />
        </div>
        <PageHeader
          title={
            isConfirmed
              ? 'Your safari is confirmed!'
              : isMpesaPending
                ? 'Complete payment on your phone'
                : 'Payment submitted'
          }
          description={
            isConfirmed
              ? 'Everything is set. Your guide details are below when assigned.'
              : isMpesaPending
                ? 'Enter your M-Pesa PIN to authorize payment. This page updates automatically.'
                : 'We received your payment details and are verifying them.'
          }
        />
      </div>

      {isMpesaPending && (
        <MpesaPaymentPoller bookingId={id} mpesaPhone={payment?.mpesa_phone} />
      )}

      {driverAssignment && (
        <div className="mb-8">
          <DriverAssignmentCard
            driverName={driverAssignment.driverName}
            driverEmail={driverAssignment.driverEmail}
            licenseNumber={driverAssignment.license_number}
            experienceYears={driverAssignment.experience_years}
            vehicle={driverAssignment.vehicle}
          />
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Booking reference</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-lg font-bold text-primary">{booking.id}</p>
            {booking.package_title && (
              <p className="mt-2 text-sm text-muted-foreground">{booking.package_title}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Payment status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold capitalize">{payment?.status ?? 'pending'}</p>
            {isMpesaConfirmed && (
              <p className="mt-2 text-xs text-muted-foreground">
                M-Pesa receipt: <span className="font-mono">{payment.mpesa_receipt}</span>
              </p>
            )}
            {payment?.transaction_id && !isMpesaConfirmed && (
              <p className="mt-2 font-mono text-xs text-muted-foreground">{payment.transaction_id}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-display text-lg">What happens next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {isConfirmed ? (
            <>
              <p>1. Your booking is locked in — no further payment needed.</p>
              <p>2. Your assigned guide will reach out before departure with pickup details.</p>
              <p>3. Contact support if you need to adjust travel dates or guest count.</p>
            </>
          ) : isMpesaPending ? (
            <>
              <p>1. Check your phone for the Safaricom STK Push prompt.</p>
              <p>2. Enter your M-Pesa PIN to authorize payment.</p>
              <p>3. Once confirmed, your booking status updates automatically.</p>
            </>
          ) : (
            <>
              <p>1. Our team verifies your payment in the admin console.</p>
              <p>2. Once approved, your booking status changes to confirmed.</p>
              <p>3. Track status anytime from My Bookings.</p>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link href="/customer-dashboard" className="flex-1">
          <Button size="lg" className="w-full">
            View my bookings
          </Button>
        </Link>
        <Link href="/packages" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">
            Browse more safaris
          </Button>
        </Link>
      </div>
    </>
  )
}
