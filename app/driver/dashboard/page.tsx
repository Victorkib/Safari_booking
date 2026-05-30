import Link from 'next/link'
import { getDriverBookings } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'
import { StatTile } from '@/components/safari/stat-tile'
import { TripCard } from '@/components/safari/trip-card'
import { EmptySafari } from '@/components/safari/empty-safari'
import { Calendar, Compass, History, Zap } from 'lucide-react'

export default async function DriverDashboard() {
  const driverBookings = await getDriverBookings()
  const confirmed = driverBookings.filter((b) => b.status === 'confirmed' || b.status === 'completed')

  const now = new Date()
  const upcomingBookings = confirmed.filter((b) => new Date(`${b.start_date}T00:00:00`) > now)
  const completedBookings = confirmed.filter((b) => new Date(`${b.end_date}T23:59:59`) < now)
  const activeBookings = confirmed.filter((b) => {
    const start = new Date(`${b.start_date}T00:00:00`)
    const end = new Date(`${b.end_date}T23:59:59`)
    return start <= now && now <= end
  })

  return (
    <>
      <PageHeader
        title="Driver dashboard"
        description="Your assigned tours and field schedule"
      />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Assigned tours" value={confirmed.length} icon={Compass} accent="primary" />
        <StatTile label="Active now" value={activeBookings.length} icon={Zap} accent="gold" />
        <StatTile label="Upcoming" value={upcomingBookings.length} icon={Calendar} accent="gold" />
        <StatTile label="Completed" value={completedBookings.length} icon={History} accent="primary" />
      </div>

      {driverBookings.length === 0 && (
        <EmptySafari
          title="No tours assigned yet"
          description="When an admin assigns bookings to your driver profile, they will appear here with full guest and preparation details."
        />
      )}

      {activeBookings.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display mb-4 text-xl font-semibold text-accent">Active tours</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {activeBookings.map((booking) => (
              <TripCard
                key={booking.id}
                trip={booking}
                href={`/driver/tours/${booking.id}`}
                actionLabel="Open tour"
                variant="driver"
              />
            ))}
          </div>
        </section>
      )}

      {upcomingBookings.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Upcoming tours</h2>
            <Button asChild variant="outline" size="sm">
              <Link href="/driver/schedule">Full schedule</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingBookings.slice(0, 4).map((booking) => (
              <TripCard
                key={booking.id}
                trip={booking}
                href={`/driver/tours/${booking.id}`}
                actionLabel="Prepare"
                variant="driver"
              />
            ))}
          </div>
        </section>
      )}

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h3 className="font-display text-lg font-semibold">Quick links</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Button asChild variant="outline">
            <Link href="/driver/schedule">Schedule</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/driver/history">History</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/driver/profile">Profile</Link>
          </Button>
        </div>
      </div>
    </>
  )
}
