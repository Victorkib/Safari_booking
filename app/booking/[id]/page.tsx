import { getBookingById } from '@/app/actions/bookings'
import { getUserId } from '@/app/actions/auth'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface BookingDetailPageProps {
  params: { id: string }
}

export default async function BookingDetail({ params }: BookingDetailPageProps) {
  const userId = await getUserId().catch(() => null)

  if (!userId) {
    redirect('/sign-in')
  }

  const booking = await getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  const startDate = new Date(booking.start_date)
  const endDate = new Date(booking.end_date)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your safari adventure is booked. Check your email for confirmation details.
          </p>
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Booking Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-mono font-bold text-primary">{booking.id}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
            </CardHeader>
            <CardContent>
              <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Trip Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Travel Dates</p>
                <p className="font-semibold">
                  {startDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  to {endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Duration</p>
                <p className="font-semibold">{days} days</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Number of Guests</p>
                <p className="font-semibold">{booking.number_of_guests} {booking.number_of_guests === 1 ? 'guest' : 'guests'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Price</p>
                <p className="font-semibold text-lg">KES {booking.total_price}</p>
              </div>
            </div>

            {booking.special_requests && (
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                <p className="text-foreground">{booking.special_requests}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">1.</span>
                <span className="text-muted-foreground">
                  Complete payment to secure your booking (click the payment button below)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">2.</span>
                <span className="text-muted-foreground">
                  Receive confirmation email with itinerary and pre-trip information
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">3.</span>
                <span className="text-muted-foreground">
                  Contact our team 2 weeks before departure to finalize details
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">4.</span>
                <span className="text-muted-foreground">
                  Arrive at meeting point and begin your safari adventure!
                </span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href={`/booking/${booking.id}/payment`} className="flex-1">
            <Button size="lg" className="w-full">
              Proceed to Payment
            </Button>
          </Link>
          <Link href="/customer-dashboard" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              View Dashboard
            </Button>
          </Link>
        </div>

        {/* Contact Info */}
        <Card className="mt-8 bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Our booking support team is available 24/7
            </p>
            <p className="text-sm">
              Email: <a href="mailto:bookings@safariadventures.com" className="text-primary hover:underline">bookings@safariadventures.com</a>
            </p>
            <p className="text-sm">
              Phone: <a href="tel:+254123456789" className="text-primary hover:underline">+254 (0) 123 456 789</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
