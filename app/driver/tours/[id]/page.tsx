import {
  getBookingByIdForDriver,
  getBookingCustomerForDriver,
} from '@/app/actions/bookings'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { PrepChecklist } from '@/components/safari/prep-checklist'
import { getBookingStatusLabel, getBookingStatusStyles } from '@/lib/booking-status'
import { Mail, Phone, Users } from 'lucide-react'

interface TourDetailPageProps {
  params: Promise<{ id: string }>
}

const SUPPORT_PHONE = '+254712345678'
const SUPPORT_EMAIL = 'support@safariadventures.com'

export default async function TourDetail({ params }: TourDetailPageProps) {
  const { id } = await params
  const booking = await getBookingByIdForDriver(id)
  const customer = booking ? await getBookingCustomerForDriver(id) : null

  if (!booking) {
    notFound()
  }

  const startDate = new Date(`${booking.start_date}T00:00:00`)
  const endDate = new Date(`${booking.end_date}T00:00:00`)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const now = new Date()
  const isActive = startDate <= now && now <= endDate
  const isUpcoming = startDate > now
  const status = booking.status ?? 'pending'

  return (
    <>
      <PageHeader
        title={booking.package_title ?? `Tour #${booking.id.slice(0, 8)}`}
        description="Assigned tour details and field preparation"
        actions={
          <div className="flex gap-2">
            {isActive && (
              <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
                In progress
              </span>
            )}
            {isUpcoming && (
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800">
                Upcoming
              </span>
            )}
            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getBookingStatusStyles(status)}`}
            >
              {getBookingStatusLabel(status)}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Tour schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">Start date</p>
                  <p className="font-display text-2xl font-semibold">
                    {startDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">End date</p>
                  <p className="font-display text-2xl font-semibold">
                    {endDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{days} days total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Guest contact</CardTitle>
              <CardDescription>Primary booker for this safari group</CardDescription>
            </CardHeader>
            <CardContent>
              {customer ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 size-5 text-secondary" />
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.number_of_guests} guest{booking.number_of_guests !== 1 ? 's' : ''} in party
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm">
                      <a href={`mailto:${customer.email}`}>
                        <Mail className="mr-2 size-4" />
                        Email guest
                      </a>
                    </Button>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    Booking ref: {booking.id}
                  </p>
                  {booking.special_requests && (
                    <div className="border-t border-border pt-4">
                      <p className="mb-2 text-sm text-muted-foreground">Special requests</p>
                      <p className="whitespace-pre-wrap text-sm">{booking.special_requests}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Guest contact details are unavailable for this booking.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <PrepChecklist />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="font-display text-lg">Tour summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Package</p>
                <p className="font-semibold">{booking.package_title ?? 'Safari Package'}</p>
                {booking.package_duration_days && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.package_duration_days} days
                  </p>
                )}
              </div>

              <div className="border-t border-border pt-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Guests</p>
                <p className="font-semibold">{booking.number_of_guests}</p>
              </div>

              <div className="space-y-3 border-t border-border pt-4">
                <Button asChild className="w-full" variant="outline">
                  <a href={`tel:${SUPPORT_PHONE}`}>
                    <Phone className="mr-2 size-4" />
                    Operations: {SUPPORT_PHONE}
                  </a>
                </Button>
                <Button asChild className="w-full" variant="outline">
                  <a href={`mailto:${SUPPORT_EMAIL}`}>
                    <Mail className="mr-2 size-4" />
                    {SUPPORT_EMAIL}
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Emergency contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="mb-1 text-muted-foreground">Control center</p>
                <a href="tel:+254123456789" className="font-semibold hover:text-primary">
                  +254 (0) 123 456 789
                </a>
              </div>
              <div className="border-t border-border pt-3">
                <p className="mb-1 text-muted-foreground">Emergency medical</p>
                <a href="tel:+254999888777" className="font-semibold hover:text-primary">
                  +254 (0) 999 888 777
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
