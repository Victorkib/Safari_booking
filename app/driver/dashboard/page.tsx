import Link from 'next/link'
import { getDriverBookings } from '@/app/actions/bookings'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function DriverDashboard() {
  const driverBookings = await getDriverBookings()
  const confirmed = driverBookings.filter((b) => b.status === 'confirmed')

  const upcomingBookings = confirmed.filter((b) => new Date(b.start_date) > new Date())
  const completedBookings = confirmed.filter((b) => new Date(b.end_date) < new Date())
  const activeBookings = confirmed.filter((b) => {
    const start = new Date(b.start_date)
    const end = new Date(b.end_date)
    const now = new Date()
    return start <= now && now <= end
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Driver Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your assigned safari tours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Assigned Tours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{confirmed.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Active Now</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{activeBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Upcoming</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{upcomingBookings.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-600">{completedBookings.length}</p>
            </CardContent>
          </Card>
        </div>

        {driverBookings.length === 0 && (
          <Card className="mb-8">
            <CardContent className="pt-8 text-center text-muted-foreground">
              No tours assigned yet. An admin will assign bookings to your driver profile.
            </CardContent>
          </Card>
        )}

        {activeBookings.length > 0 && (
          <Card className="mb-8 border-accent">
            <CardHeader>
              <CardTitle className="text-accent">Active Tours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div>
                    <p className="font-bold">Tour #{booking.id.slice(0, 6)}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.number_of_guests} guests ·{' '}
                      {new Date(booking.start_date).toLocaleDateString()} –{' '}
                      {new Date(booking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/driver/tours/${booking.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader className="flex items-center justify-between">
            <div>
              <CardTitle>Upcoming Tours</CardTitle>
              <CardDescription>Your scheduled assignments</CardDescription>
            </div>
            <Link href="/driver/schedule">
              <Button variant="outline" size="sm">Full Schedule</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingBookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No upcoming tours</p>
            ) : (
              upcomingBookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-semibold">Tour #{booking.id.slice(0, 6)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.start_date).toLocaleDateString()} · {booking.number_of_guests} guests
                    </p>
                  </div>
                  <Link href={`/driver/tours/${booking.id}`}>
                    <Button size="sm" variant="outline">Prepare</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/driver/schedule"><Button variant="outline" className="w-full">Schedule</Button></Link>
            <Link href="/driver/history"><Button variant="outline" className="w-full">History</Button></Link>
            <Link href="/driver/profile"><Button variant="outline" className="w-full">Profile</Button></Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
