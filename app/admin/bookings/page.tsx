import Link from 'next/link'
import { getAllBookings } from '@/app/actions/bookings'
import { getBookingStatusLabel, getBookingStatusStyles } from '@/lib/booking-status'
import { getAllDrivers } from '@/app/actions/drivers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookingActions } from '@/components/booking-actions'
import { PageHeader } from '@/components/layout/page-header'

export default async function AdminBookings() {
  const [bookings, drivers] = await Promise.all([getAllBookings(), getAllDrivers()])

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    paid: bookings.filter(b => b.status === 'paid').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  return (
    <>
      <PageHeader
        title="Bookings Management"
        description="View and manage all safari bookings"
        actions={(
          <Button asChild>
            <Link href="/admin/bookings/new">New booking</Link>
          </Button>
        )}
      />

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Confirmed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Awaiting Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">{stats.paid}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Cancelled</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
          </CardContent>
        </Card>
      </div>

        {/* Bookings Table */}
      <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              Complete list of customer bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-semibold">Booking ID</th>
                    <th className="text-left py-4 px-4 font-semibold">Customer</th>
                    <th className="text-left py-4 px-4 font-semibold">Package</th>
                    <th className="text-left py-4 px-4 font-semibold">Start Date</th>
                    <th className="text-left py-4 px-4 font-semibold">Guests</th>
                    <th className="text-left py-4 px-4 font-semibold">Total Price</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-left py-4 px-4 font-semibold">Driver</th>
                    <th className="text-left py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-4 px-4 font-mono text-xs">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="text-primary hover:underline"
                        >
                          {booking.id.slice(0, 12)}…
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        <p className="font-medium">{booking.customer_name ?? '—'}</p>
                        <p className="text-xs text-muted-foreground">{booking.customer_email}</p>
                      </td>
                      <td className="py-4 px-4">{booking.package_title ?? booking.package_id.slice(0, 8)}</td>
                      <td className="py-4 px-4">
                        {new Date(booking.start_date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">{booking.number_of_guests}</td>
                      <td className="py-4 px-4 font-semibold">KES {booking.total_price}</td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getBookingStatusStyles(booking.status)}`}>
                          {getBookingStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-xs">
                        {booking.driver_id
                          ? drivers.find((d) => d.id === booking.driver_id)?.name ?? 'Assigned'
                          : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <BookingActions
                          bookingId={booking.id}
                          currentStatus={booking.status}
                          currentDriverId={booking.driver_id}
                          drivers={drivers.map((d) => ({ id: d.id, name: d.name }))}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {bookings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )}
            </div>
          </CardContent>
      </Card>
    </>
  )
}
