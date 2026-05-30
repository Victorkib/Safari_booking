import { getDriverBookings } from '@/app/actions/bookings'
import { PageHeader } from '@/components/layout/page-header'
import { TripCard } from '@/components/safari/trip-card'
import { EmptySafari } from '@/components/safari/empty-safari'

export default async function DriverSchedulePage() {
  const bookings = await getDriverBookings()
  const upcoming = bookings
    .filter((b) => new Date(`${b.end_date}T23:59:59`) >= new Date())
    .sort(
      (a, b) =>
        new Date(`${a.start_date}T00:00:00`).getTime() -
        new Date(`${b.start_date}T00:00:00`).getTime()
    )

  return (
    <>
      <PageHeader title="My schedule" description="Upcoming and active assigned tours" />

      {upcoming.length === 0 ? (
        <EmptySafari
          title="No scheduled tours"
          description="Your upcoming assignments will appear here once confirmed by operations."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {upcoming.map((b) => (
            <TripCard
              key={b.id}
              trip={b}
              href={`/driver/tours/${b.id}`}
              actionLabel="View tour"
              variant="driver"
            />
          ))}
        </div>
      )}
    </>
  )
}
