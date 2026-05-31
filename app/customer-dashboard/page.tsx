import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getUserBookings } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import { CustomerPageHeader } from '@/components/layout/customer-page-header'
import {
  BookingFilterTabs,
  type BookingFilter,
} from '@/components/customer/booking-filter-tabs'
import { StatTile } from '@/components/safari/stat-tile'
import { TripCard } from '@/components/safari/trip-card'
import { EmptySafari } from '@/components/safari/empty-safari'
import { getPackageImageUrl } from '@/lib/safari-images'
import { canSubmitPayment } from '@/lib/booking-status'
import { filterCustomerBookings } from '@/lib/customer-bookings'
import { compareDateStrings, formatDateLong, todayDateString } from '@/lib/booking-dates'
import { BookOpen, CalendarDays, Wallet } from 'lucide-react'

function isWithinNext30Days(dateStr: string) {
  const today = todayDateString()
  const in30 = compareDateStrings(dateStr, today) >= 0
  const before30 = (() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return compareDateStrings(dateStr, `${y}-${m}-${day}`) <= 0
  })()
  return in30 && before30
}

function getNextTrip(bookings: Awaited<ReturnType<typeof getUserBookings>>) {
  const today = todayDateString()
  return bookings
    .filter(
      (b) => b.status !== 'cancelled' && compareDateStrings(b.end_date, today) >= 0
    )
    .sort((a, b) => compareDateStrings(a.start_date, b.start_date))[0]
}

function getActionForBooking(booking: { id: string; status?: string | null }) {
  const status = booking.status ?? 'pending'
  if (canSubmitPayment(status)) {
    return {
      label: 'Complete payment',
      href: `/booking/${booking.id}/payment`,
    }
  }
  if (status === 'paid') {
    return { label: 'Track status', href: `/booking/${booking.id}` }
  }
  return { label: 'View trip', href: `/booking/${booking.id}` }
}

const EMPTY_COPY: Record<
  BookingFilter,
  { title: string; description: string }
> = {
  all: {
    title: 'No safaris yet',
    description:
      'Your first African adventure is just a few clicks away. Browse our curated packages and secure your dates.',
  },
  pending: {
    title: 'No pending payments',
    description: 'When you create a booking, trips awaiting payment will appear here.',
  },
  upcoming: {
    title: 'No upcoming trips',
    description: 'Book a safari to see your confirmed and scheduled journeys here.',
  },
  past: {
    title: 'No past trips',
    description: 'Completed and ended safaris will be archived here.',
  },
  cancelled: {
    title: 'No cancelled bookings',
    description: 'Cancelled trips will appear in this list if any.',
  },
}

function parseFilter(value: string | undefined): BookingFilter {
  if (
    value === 'pending' ||
    value === 'upcoming' ||
    value === 'past' ||
    value === 'cancelled'
  ) {
    return value
  }
  return 'all'
}

interface CustomerDashboardProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function CustomerDashboard({
  searchParams,
}: CustomerDashboardProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const { filter: filterParam } = await searchParams
  const filter = parseFilter(filterParam)

  const bookings = await getUserBookings()
  const filtered = filterCustomerBookings(bookings, filter)
  const nextTrip = filter === 'all' ? getNextTrip(bookings) : null
  const upcoming30 = bookings.filter(
    (b) => isWithinNext30Days(b.start_date) && b.status !== 'cancelled'
  ).length
  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.total_price), 0)

  const empty = EMPTY_COPY[filter]

  return (
    <>
      <CustomerPageHeader
        eyebrow="Your safari hub"
        title={`Welcome back, ${session.user.name?.split(' ')[0] ?? 'Traveler'}`}
        description="Your safari journeys, beautifully organized"
        actions={
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/packages">Book new safari</Link>
          </Button>
        }
      />

      {nextTrip && (
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-border/80">
          <div className="relative aspect-[21/9] min-h-[200px] sm:min-h-[260px]">
            <Image
              src={getPackageImageUrl(
                nextTrip.package_id,
                nextTrip.package_destinations
              )}
              alt={nextTrip.package_title ?? 'Upcoming safari'}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
                {nextTrip.status === 'confirmed'
                  ? 'Confirmed — next departure'
                  : 'Upcoming trip'}
              </p>
              <h2 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
                {nextTrip.package_title ?? 'Safari adventure'}
              </h2>
              <p className="mt-2 text-sm text-white/80">
                {formatDateLong(nextTrip.start_date)} · {nextTrip.number_of_guests}{' '}
                guest{nextTrip.number_of_guests !== 1 ? 's' : ''}
              </p>
              <div className="mt-4">
                <Button
                  asChild
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Link href={getActionForBooking(nextTrip).href}>
                    {getActionForBooking(nextTrip).label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatTile
          label="Total bookings"
          value={bookings.length}
          description="All time"
          icon={BookOpen}
          accent="primary"
        />
        <StatTile
          label="Upcoming trips"
          value={upcoming30}
          description="Next 30 days"
          icon={CalendarDays}
          accent="gold"
        />
        <StatTile
          label="Total spent"
          value={`KES ${totalSpent.toLocaleString()}`}
          description="Completed safaris only"
          icon={Wallet}
          accent="primary"
        />
      </div>

      <h2 className="font-display mb-4 text-2xl font-semibold">Your bookings</h2>
      <BookingFilterTabs active={filter} />

      {filtered.length === 0 ? (
        <EmptySafari
          title={bookings.length === 0 ? EMPTY_COPY.all.title : empty.title}
          description={
            bookings.length === 0 ? EMPTY_COPY.all.description : empty.description
          }
          actionLabel={filter === 'cancelled' ? undefined : 'Explore packages'}
          actionHref={filter === 'cancelled' ? undefined : '/packages'}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((booking) => {
            const action = getActionForBooking(booking)
            return (
              <TripCard
                key={booking.id}
                trip={{
                  ...booking,
                  destinations: booking.package_destinations,
                }}
                href={`/booking/${booking.id}`}
                actionLabel={action.label}
                actionHref={action.href}
                showPrice
              />
            )
          })}
        </div>
      )}
    </>
  )
}
