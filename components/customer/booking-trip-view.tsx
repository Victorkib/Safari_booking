import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DriverAssignmentCard } from '@/components/safari/driver-assignment-card'
import {
  TripStepper,
  BOOKING_FLOW_STEPS,
  bookingStatusToStepId,
} from '@/components/safari/trip-stepper'
import {
  canSubmitPayment,
  getBookingStatusLabel,
  getBookingStatusStyles,
} from '@/lib/booking-status'
import { formatDateRange, tripDayCount } from '@/lib/booking-dates'
import { getPackageImageUrl } from '@/lib/safari-images'
import { Calendar, Users } from 'lucide-react'

type PaymentSummary = {
  payment_method?: string | null
  status?: string | null
  transaction_id?: string | null
} | null

type DriverAssignment = {
  driverName: string
  driverEmail: string
  license_number?: string | null
  experience_years?: number | null
  vehicle?: {
    make_model: string
    registration_number: string
    vehicle_type: string
  } | null
} | null

export type BookingTripData = {
  id: string
  package_id: string
  package_title?: string | null
  start_date: string
  end_date: string
  number_of_guests: number
  total_price: string
  status?: string | null
  special_requests?: string | null
}

interface BookingTripViewProps {
  booking: BookingTripData
  payment?: PaymentSummary
  driverAssignment?: DriverAssignment
  headerTitle: string
  headerDescription: string
  showStepper?: boolean
  children?: React.ReactNode
}

export function BookingTripView({
  booking,
  payment,
  driverAssignment,
  headerTitle,
  headerDescription,
  showStepper = true,
  children,
}: BookingTripViewProps) {
  const status = booking.status ?? 'pending'
  const imageUrl = getPackageImageUrl(booking.package_id)
  const days = tripDayCount(booking.start_date, booking.end_date)

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/80">
        <div className="relative aspect-[21/9] min-h-[160px] sm:min-h-[200px]">
          <Image
            src={imageUrl}
            alt={booking.package_title ?? 'Safari trip'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <span
              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${getBookingStatusStyles(status)}`}
            >
              {getBookingStatusLabel(status)}
            </span>
            <h1 className="font-display mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {booking.package_title ?? 'Safari booking'}
            </h1>
            <p className="mt-1 text-sm text-white/80">{headerDescription}</p>
          </div>
        </div>
      </section>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
          {headerTitle}
        </p>
      </div>

      {showStepper && (
        <div className="rounded-xl border border-border/80 bg-card/50 p-4 sm:p-6">
          <TripStepper
            steps={BOOKING_FLOW_STEPS}
            currentStepId={bookingStatusToStepId(status)}
          />
        </div>
      )}

      {driverAssignment && (
        <DriverAssignmentCard
          driverName={driverAssignment.driverName}
          driverEmail={driverAssignment.driverEmail}
          licenseNumber={driverAssignment.license_number}
          experienceYears={driverAssignment.experience_years}
          vehicle={driverAssignment.vehicle}
        />
      )}

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="font-display text-lg">Trip summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 size-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Travel dates</p>
                <p className="font-semibold">
                  {formatDateRange(booking.start_date, booking.end_date)}
                </p>
                <p className="text-xs text-muted-foreground">{days} days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 size-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Guests</p>
                <p className="font-semibold">{booking.number_of_guests}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking reference</p>
              <p className="font-mono text-sm font-semibold">{booking.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-display text-xl font-semibold text-primary">
                KES {parseFloat(booking.total_price).toLocaleString()}
              </p>
            </div>
          </div>
          {booking.special_requests && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Special requests</p>
              <p className="mt-1 text-sm">{booking.special_requests}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {payment && (
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-lg">Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Method:</strong>{' '}
              {payment.payment_method?.replace('_', ' ') ?? '—'}
            </p>
            <p>
              <strong>Status:</strong> {payment.status ?? '—'}
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

      {children}

      <div className="flex flex-col gap-3 sm:flex-row">
        {canSubmitPayment(status) && (
          <Button asChild size="lg" className="flex-1">
            <Link href={`/booking/${booking.id}/payment`}>Pay now</Link>
          </Button>
        )}
        <Button asChild size="lg" variant="outline" className="flex-1">
          <Link href="/customer-dashboard">My trips</Link>
        </Button>
      </div>
    </div>
  )
}
