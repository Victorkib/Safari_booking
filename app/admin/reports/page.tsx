import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getAllPayments } from '@/app/actions/payments'
import { getAllBookings } from '@/app/actions/bookings'
import { getAllPackages } from '@/app/actions/packages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function AdminReports() {
  const session = await getSession()
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    redirect('/sign-in')
  }

  const payments = await getAllPayments()
  const bookings = await getAllBookings()
  const packages = await getAllPackages()

  // Calculate metrics
  const completedPayments = payments.filter(p => p.status === 'completed')
  const totalRevenue = completedPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0)
  const avgRevenue = completedPayments.length > 0 ? totalRevenue / completedPayments.length : 0
  
  const bookingsByMonth = bookings.reduce((acc, booking) => {
    const month = new Date(booking.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topPackages = packages
    .map(pkg => ({
      ...pkg,
      bookingCount: bookings.filter(b => b.package_id === pkg.id).length,
    }))
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 5)

  const guestDemographics = {
    total: bookings.reduce((sum, b) => sum + b.number_of_guests, 0),
    average: bookings.length > 0 ? Math.round(bookings.reduce((sum, b) => sum + b.number_of_guests, 0) / bookings.length) : 0,
    maxGroup: Math.max(...bookings.map(b => b.number_of_guests), 0),
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Business Reports</h1>
          <p className="text-muted-foreground">
            Analytics and performance metrics for your safari business
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-700">KES {totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                From {completedPayments.length} payments
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Avg Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">KES {avgRevenue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground mt-1">Average payment amount</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Guests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{guestDemographics.total}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Avg {guestDemographics.average} per booking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {bookings.length > 0 ? Math.round((completedPayments.length / bookings.length) * 100) : 0}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">Booked to paid</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bookings by Month */}
          <Card>
            <CardHeader>
              <CardTitle>Bookings by Month</CardTitle>
              <CardDescription>Monthly booking trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(bookingsByMonth).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No booking data yet</p>
                ) : (
                  Object.entries(bookingsByMonth)
                    .slice(-6)
                    .map(([month, count]) => (
                      <div key={month}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{month}</span>
                          <span className="text-sm font-bold">{count}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{
                              width: `${Math.max(10, (count / Math.max(...Object.values(bookingsByMonth))) * 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Packages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Packages</CardTitle>
              <CardDescription>Most booked safaris</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPackages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No package data yet</p>
                ) : (
                  topPackages.map((pkg, index) => (
                    <div key={pkg.id} className="flex items-center justify-between pb-4 border-b border-border last:border-0">
                      <div>
                        <p className="font-semibold text-sm">
                          {index + 1}. {pkg.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{pkg.duration_days} days</p>
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-bold bg-accent text-accent-foreground">
                        {pkg.bookingCount} bookings
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Guest Demographics */}
          <Card>
            <CardHeader>
              <CardTitle>Guest Demographics</CardTitle>
              <CardDescription>Visitor statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Total Guests</span>
                    <span className="text-2xl font-bold">{guestDemographics.total}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Across all bookings</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Average Group Size</span>
                    <span className="text-2xl font-bold">{guestDemographics.average}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Guests per booking</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Largest Group</span>
                    <span className="text-2xl font-bold">{guestDemographics.maxGroup}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Biggest party size</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Transaction breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Completed', count: payments.filter(p => p.status === 'completed').length, color: 'bg-green-500' },
                  { label: 'Pending', count: payments.filter(p => p.status === 'pending').length, color: 'bg-yellow-500' },
                  { label: 'Failed', count: payments.filter(p => p.status === 'failed').length, color: 'bg-red-500' },
                ].map(({ label, count, color }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{label}</span>
                      <span className="text-sm font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`${color} h-2 rounded-full`}
                        style={{
                          width: `${Math.max(5, (count / Math.max(...[payments.filter(p => p.status === 'completed').length, payments.filter(p => p.status === 'pending').length, payments.filter(p => p.status === 'failed').length])) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>Download business reports in various formats</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="w-full">
                📊 Export as CSV
              </Button>
              <Button variant="outline" className="w-full">
                📄 Export as PDF
              </Button>
              <Button variant="outline" className="w-full">
                📈 Export as Excel
              </Button>
              <Button variant="outline" className="w-full">
                📧 Email Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
