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
import { MpesaPaymentPoller } from '@/components/mpesa-payment-poller'
import { BookingTripView } from '@/components/customer/booking-trip-view'
import { PartyPopper, Clock, CheckCircle2 } from 'lucide-react'

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

  const driverAssignment = isConfirmed
    ? await getBookingDriverAssignment(id)
    : null

  const headerCopy = isConfirmed
    ? {
        title: 'Your safari is confirmed',
        description: 'Everything is set. Your guide details appear below when assigned.',
      }
    : isMpesaPending
      ? {
          title: 'Complete payment on your phone',
          description: 'Enter your M-Pesa PIN when prompted. This page updates automatically.',
        }
      : {
          title: 'Payment submitted',
          description: 'We received your payment and are verifying it. Track status from My Trips.',
        }

  const StatusIcon = isConfirmed ? PartyPopper : isMpesaPending ? Clock : CheckCircle2

  return (
    <>
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-border/80 bg-card/60 p-4">
        <div
          className={`flex size-12 shrink-0 items-center justify-center rounded-full ${
            isConfirmed
              ? 'bg-secondary/20 text-secondary'
              : isMpesaPending
                ? 'bg-amber-500/15 text-amber-700'
                : 'bg-primary/10 text-primary'
          }`}
        >
          <StatusIcon className="size-6" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold">{headerCopy.title}</p>
          <p className="text-sm text-muted-foreground">{headerCopy.description}</p>
        </div>
      </div>

      {isMpesaPending && (
        <div className="mb-6">
          <MpesaPaymentPoller bookingId={id} mpesaPhone={payment?.mpesa_phone} />
        </div>
      )}

      <BookingTripView
        booking={booking}
        payment={payment ?? null}
        driverAssignment={driverAssignment}
        headerTitle={headerCopy.title}
        headerDescription={headerCopy.description}
        showStepper
      >
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-lg">What happens next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            {isConfirmed ? (
              <>
                <p>1. Your booking is locked in — no further payment needed.</p>
                <p>2. Your guide will reach out before departure with pickup details.</p>
                <p>3. Contact support if you need to adjust dates or guest count.</p>
              </>
            ) : isMpesaPending ? (
              <>
                <p>1. Check your phone for the Safaricom STK Push prompt.</p>
                <p>2. Enter your M-Pesa PIN to authorize payment.</p>
                <p>3. Once confirmed, your booking updates automatically.</p>
              </>
            ) : (
              <>
                <p>1. Our team verifies your payment in the admin console.</p>
                <p>2. Once approved, your booking status changes to confirmed.</p>
                <p>3. Track status anytime from My Trips.</p>
              </>
            )}
          </CardContent>
        </Card>
      </BookingTripView>

      <div className="-mt-4 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" variant="outline" className="flex-1">
          <Link href="/packages">Browse more safaris</Link>
        </Button>
      </div>
    </>
  )
}
