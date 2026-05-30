import {
  getBookingById,
  getBookingDriverAssignment,
} from '@/app/actions/bookings'
import { getPaymentByBookingId } from '@/app/actions/payments'
import { getUserId } from '@/app/actions/auth'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { TripStepper, BOOKING_FLOW_STEPS, bookingStatusToStepId } from '@/components/safari/trip-stepper'
import { DriverAssignmentCard } from '@/components/safari/driver-assignment-card'
import {
  canSubmitPayment,
  getBookingStatusLabel,
  getBookingStatusStyles,
} from '@/lib/booking-status'
import Link from 'next/link'

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetail({ params }: BookingDetailPageProps) {
  const { id } = await params
  const userId = await getUserId().catch(() => null)

  if (!userId) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/booking/${id}`)}`)
  }

  const booking = await getBookingById(id)

  if (!booking) {
    notFound()
  }

  const payment = await getPaymentByBookingId(id)
  const status = booking.status ?? 'pending'
  const startDate = new Date(`${booking.start_date}T00:00:00`)
  const endDate = new Date(`${booking.end_date}T00:00:00`)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const driverAssignment =
    status === 'confirmed' || status === 'completed'
      ? await getBookingDriverAssignment(id)
      : null

  const headerCopy = {
    pending: {
      title: 'Booking created',
      description: 'Complete payment to secure your safari spot.',
    },
    paid: {
      title: 'Payment submitted',
      description: 'Our team is verifying your payment. You will be notified once confirmed.',
    },
    confirmed: {
      title: 'Booking confirmed',
      description: 'Your safari is confirmed. Meet your guide below and prepare for departure.',
    },
    cancelled: {
      title: 'Booking cancelled',
      description: 'This booking has been cancelled.',
    },
    completed: {
      title: 'Safari completed',
      description: 'Thank you for travelling with Safari Adventures.',
    },
  }[status] ?? {
    title: 'Booking details',
    description: 'Review your safari booking information.',
  }

  return (
    <>
      <PageHeader title={headerCopy.title} description={headerCopy.description} />

      <div className="mb-8 rounded-xl border border-border/80 bg-card/50 p-4 sm:p-6">
        <TripStepper
          steps={BOOKING_FLOW_STEPS}
          currentStepId={bookingStatusToStepId(status)}
        />
      </div>

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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${getBookingStatusStyles(status)}`}
            >
              {getBookingStatusLabel(status)}
            </span>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="font-display text-lg">Trip details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Safari package</p>
              <p className="font-semibold">{booking.package_title ?? 'Safari Package'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Travel dates</p>
              <p className="font-semibold">
                {startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm text-muted-foreground">
                to {endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Duration</p>
              <p className="font-semibold">{days} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Guests</p>
              <p className="font-semibold">{booking.number_of_guests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Total price</p>
              <p className="font-display text-xl font-semibold text-primary">
                KES {parseFloat(booking.total_price).toLocaleString()}
              </p>
            </div>
          </div>
          {booking.special_requests && (
            <div className="mt-6 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground mb-2">Special requests</p>
              <p>{booking.special_requests}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {payment && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-display text-lg">Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Method:</strong> {payment.payment_method?.replace('_', ' ') ?? '—'}
            </p>
            <p>
              <strong>Status:</strong> {payment.status}
            </p>
            {payment.transaction_id && (
              <p>
                <strong>Reference:</strong>{' '}
                <span className="font-mono">{payment.transaction_id}</span>
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        {canSubmitPayment(status) && (
          <Link href={`/booking/${booking.id}/payment`} className="flex-1">
            <Button size="lg" className="w-full">
              Proceed to payment
            </Button>
          </Link>
        )}
        {status === 'paid' && (
          <Link href="/customer-dashboard" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Back to my bookings
            </Button>
          </Link>
        )}
        {(status === 'confirmed' || status === 'completed') && (
          <Link href="/customer-dashboard" className="flex-1">
            <Button size="lg" className="w-full">
              View my bookings
            </Button>
          </Link>
        )}
      </div>
    </>
  )
}
