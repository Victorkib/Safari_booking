import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getBookingByIdForAdmin } from '@/app/actions/bookings'
import { getAllDrivers } from '@/app/actions/drivers'
import { getPaymentsForBookingAdmin, isMpesaLive } from '@/app/actions/payments'
import { PageHeader } from '@/components/layout/page-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingActions } from '@/components/booking-actions'
import { AdminPaymentForm } from '@/components/admin/admin-payment-form'
import { getBookingStatusLabel, getBookingStatusStyles } from '@/lib/booking-status'
import { formatDateRange, tripDayCount } from '@/lib/booking-dates'

interface AdminBookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function AdminBookingDetailPage({ params }: AdminBookingDetailPageProps) {
  const { id } = await params
  const booking = await getBookingByIdForAdmin(id)

  if (!booking) {
    notFound()
  }

  const [drivers, payments, mpesaLive] = await Promise.all([
    getAllDrivers(),
    getPaymentsForBookingAdmin(id),
    isMpesaLive(),
  ])

  const pendingPayment = payments.find((p) => p.status === 'pending')
  const status = booking.status ?? 'pending'

  return (
    <>
      <PageHeader
        title={booking.package_title ?? 'Booking detail'}
        description={`${booking.customer_name ?? 'Customer'} · ${booking.customer_email ?? ''}`}
        actions={(
          <Button variant="outline" asChild>
            <Link href="/admin/bookings">All bookings</Link>
          </Button>
        )}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${getBookingStatusStyles(status)}`}
        >
          {getBookingStatusLabel(status)}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{booking.id}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Dates:</strong>{' '}
              {formatDateRange(booking.start_date, booking.end_date)} (
              {tripDayCount(booking.start_date, booking.end_date)} days)
            </p>
            <p>
              <strong>Guests:</strong> {booking.number_of_guests}
            </p>
            <p>
              <strong>Total:</strong> KES {parseFloat(booking.total_price).toLocaleString()}
            </p>
            {booking.special_requests && (
              <p>
                <strong>Requests:</strong> {booking.special_requests}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingActions
              bookingId={booking.id}
              currentStatus={status}
              currentDriverId={booking.driver_id}
              drivers={drivers.map((d) => ({ id: d.id, name: d.name }))}
            />
          </CardContent>
        </Card>
      </div>

      {status === 'pending' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Record payment</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminPaymentForm
              bookingId={booking.id}
              amount={booking.total_price}
              mpesaLive={mpesaLive}
              pendingPaymentId={pendingPayment?.id}
            />
          </CardContent>
        </Card>
      )}

      {payments.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {payments.map((p) => (
              <div key={p.id} className="rounded border p-3">
                <p>
                  <strong>{p.payment_method}</strong> — {p.status}
                </p>
                {p.transaction_id && (
                  <p className="font-mono text-xs">{p.transaction_id}</p>
                )}
                {p.mpesa_receipt && <p className="text-xs">Receipt: {p.mpesa_receipt}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}
