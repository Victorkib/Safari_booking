import { getAllBookings } from '@/app/actions/bookings'
import { getBookingStatusLabel, getBookingStatusStyles } from '@/lib/booking-status'
import { getAllPayments } from '@/app/actions/payments'
import { getAdminPackages } from '@/app/actions/packages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import Link from 'next/link'

export default async function AdminDashboard() {
  const bookings = await getAllBookings()
  const payments = await getAllPayments()
  const packages = await getAdminPackages()

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount), 0)

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length
  const pendingBookings = bookings.filter(b => b.status === 'pending').length
  const paidBookings = bookings.filter(b => b.status === 'paid').length

  return (
    <>
      <PageHeader
        title="Admin Dashboard"
        description="Manage bookings, payments, and safari packages"
      />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">KES {totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-2">From completed payments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{bookings.length}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {confirmedBookings} confirmed, {pendingBookings} awaiting payment, {paidBookings} pending verification
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Active Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{packages.length}</p>
              <p className="text-xs text-muted-foreground mt-2">Safari packages available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Awaiting verification</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings Management */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest safari bookings</CardDescription>
              </div>
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-sm">{booking.package_title ?? booking.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(booking.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getBookingStatusStyles(booking.status)}`}>
                      {getBookingStatusLabel(booking.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payments Management */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Payment verification required</CardDescription>
              </div>
              <Link href="/admin/payments">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.filter(p => p.status === 'pending').slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                    <div>
                      <p className="font-semibold text-sm">KES {payment.amount}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.payment_method || 'Unknown method'}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Verify</Button>
                  </div>
                ))}
                {payments.filter(p => p.status === 'pending').length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    All payments verified!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Package Management */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Safari Packages</CardTitle>
                <CardDescription>Manage and create safari packages</CardDescription>
              </div>
              <Link href="/admin/packages/new">
                <Button>Create New Package</Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 font-semibold">Package Name</th>
                      <th className="text-left py-3 font-semibold">Duration</th>
                      <th className="text-left py-3 font-semibold">Price</th>
                      <th className="text-left py-3 font-semibold">Status</th>
                      <th className="text-left py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.slice(0, 5).map((pkg) => (
                      <tr key={pkg.id} className="border-b border-border hover:bg-muted/50">
                        <td className="py-3">{pkg.title}</td>
                        <td className="py-3">{pkg.duration_days} days</td>
                        <td className="py-3">KES {pkg.price}</td>
                        <td className="py-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                            {pkg.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Link href={`/admin/packages/${pkg.id}/edit`}>
                              <Button size="sm" variant="outline">Edit</Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/admin/packages/new">
                <Button variant="outline" className="w-full justify-start">
                  <span>➕ New Package</span>
                </Button>
              </Link>
              <Link href="/admin/bookings">
                <Button variant="outline" className="w-full justify-start">
                  <span>📋 View Bookings</span>
                </Button>
              </Link>
              <Link href="/admin/payments">
                <Button variant="outline" className="w-full justify-start">
                  <span>💰 Process Payments</span>
                </Button>
              </Link>
              <Link href="/admin/reports">
                <Button variant="outline" className="w-full justify-start">
                  <span>📊 View Reports</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
    </>
  )
}
