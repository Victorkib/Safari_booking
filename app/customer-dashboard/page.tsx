import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserBookings } from '@/app/actions/bookings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function CustomerDashboard() {
  const session = await getSession()
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const bookings = await getUserBookings()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome, {session.user.name || session.user.email}
          </h1>
          <p className="text-muted-foreground">
            Manage your safari bookings and track your adventures
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{bookings.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Trips</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">
                {bookings.filter(b => new Date(b.start_date) > new Date()).length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Spent</CardTitle>
              <CardDescription>Lifetime spending</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">
                KES {bookings.reduce((sum, b) => sum + parseFloat(b.total_price), 0).toFixed(0)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Bookings</h2>
            <Link href="/packages">
              <Button>Book a New Safari</Button>
            </Link>
          </div>

          {bookings.length === 0 ? (
            <Card>
              <CardContent className="pt-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t booked any safaris yet. Start your adventure today!
                </p>
                <Link href="/packages">
                  <Button>Explore Packages</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>Safari Booking #{booking.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Guests</p>
                        <p className="font-semibold">{booking.number_of_guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Price</p>
                        <p className="font-semibold">KES {booking.total_price}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Package ID</p>
                        <p className="font-semibold text-xs">{booking.package_id.slice(0, 8)}...</p>
                      </div>
                      <div className="flex items-end">
                        <Link href={`/booking/${booking.id}`}>
                          <Button variant="outline" size="sm">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
