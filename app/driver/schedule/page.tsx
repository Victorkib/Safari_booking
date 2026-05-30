import Link from 'next/link'
import { getDriverBookings } from '@/app/actions/bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function DriverSchedulePage() {
  const bookings = await getDriverBookings()
  const upcoming = bookings
    .filter((b) => new Date(b.end_date) >= new Date())
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Schedule</h1>
          <Link href="/driver/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
        <Card>
          <CardHeader><CardTitle>Upcoming &amp; Active Tours</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {upcoming.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No scheduled tours</p>
            ) : (
              upcoming.map((b) => (
                <div key={b.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                  <div>
                    <p className="font-semibold">Tour #{b.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(b.start_date).toLocaleDateString()} – {new Date(b.end_date).toLocaleDateString()}
                      · {b.number_of_guests} guests · {b.status}
                    </p>
                  </div>
                  <Link href={`/driver/tours/${b.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
