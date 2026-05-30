import { getDriverBookings } from '@/app/actions/bookings'
import { PageHeader } from '@/components/layout/page-header'
import { TripCard } from '@/components/safari/trip-card'
import { EmptySafari } from '@/components/safari/empty-safari'

export default async function DriverHistoryPage() {
  const bookings = await getDriverBookings()
  const completed = bookings
    .filter((b) => new Date(`${b.end_date}T23:59:59`) < new Date())
    .sort(
      (a, b) =>
        new Date(`${b.end_date}T00:00:00`).getTime() -
        new Date(`${a.end_date}T00:00:00`).getTime()
    )

  return (
    <>
      <PageHeader title="Tour history" description="Completed assigned tours" />

      {completed.length === 0 ? (
        <EmptySafari
          title="No completed tours yet"
          description="Finished safaris will be archived here for your records."
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {completed.map((b) => (
            <TripCard
              key={b.id}
              trip={b}
              href={`/driver/tours/${b.id}`}
              actionLabel="Review"
              variant="driver"
            />
          ))}
        </div>
      )}
    </>
  )
}
