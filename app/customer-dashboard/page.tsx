import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { getUserBookings } from '@/app/actions/bookings';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { StatTile } from '@/components/safari/stat-tile';
import { TripCard } from '@/components/safari/trip-card';
import { EmptySafari } from '@/components/safari/empty-safari';
import { getPackageImageUrl } from '@/lib/safari-images';
import { canSubmitPayment } from '@/lib/booking-status';
import { BookOpen, CalendarDays, Wallet } from 'lucide-react';

function isWithinNext30Days(dateStr: string) {
  const start = new Date(`${dateStr}T00:00:00`);
  const now = new Date();
  const in30 = new Date();
  in30.setDate(in30.getDate() + 30);
  return start >= now && start <= in30;
}

function getNextTrip(bookings: Awaited<ReturnType<typeof getUserBookings>>) {
  const now = new Date();
  return bookings
    .filter((b) => {
      const end = new Date(`${b.end_date}T23:59:59`);
      return end >= now && b.status !== 'cancelled';
    })
    .sort(
      (a, b) =>
        new Date(`${a.start_date}T00:00:00`).getTime() -
        new Date(`${b.start_date}T00:00:00`).getTime(),
    )[0];
}

function getActionForBooking(booking: { id: string; status?: string | null }) {
  const status = booking.status ?? 'pending';
  if (canSubmitPayment(status)) {
    return {
      label: 'Complete payment',
      href: `/booking/${booking.id}/payment`,
    };
  }
  if (status === 'paid') {
    return { label: 'Track status', href: `/booking/${booking.id}` };
  }
  return { label: 'View trip', href: `/booking/${booking.id}` };
}

export default async function CustomerDashboard() {
  const session = await getSession();

  if (!session?.user) {
    redirect('/sign-in');
  }

  const bookings = await getUserBookings();
  const nextTrip = getNextTrip(bookings);
  const upcoming30 = bookings.filter(
    (b) => isWithinNext30Days(b.start_date) && b.status !== 'cancelled',
  ).length;
  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + parseFloat(b.total_price), 0);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${session.user.name?.split(' ')[0] ?? 'Traveler'}`}
        description="Your safari journeys, beautifully organized"
      />

      {nextTrip && (
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-border/80">
          <div className="relative aspect-[21/9] min-h-[200px] sm:min-h-[260px]">
            <Image
              src={getPackageImageUrl(nextTrip.package_id)}
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
                {new Date(`${nextTrip.start_date}T00:00:00`).toLocaleDateString(
                  'en-KE',
                  {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  },
                )}{' '}
                · {nextTrip.number_of_guests} guest
                {nextTrip.number_of_guests !== 1 ? 's' : ''}
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

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Your bookings</h2>
        <Button asChild>
          <Link href="/packages">Book a new safari</Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <EmptySafari
          title="No safaris yet"
          description="Your first African adventure is just a few clicks away. Browse our curated packages and secure your dates."
          actionLabel="Explore packages"
          actionHref="/packages"
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {bookings.map((booking) => {
            const action = getActionForBooking(booking);
            return (
              <TripCard
                key={booking.id}
                trip={booking}
                href={`/booking/${booking.id}`}
                actionLabel={action.label}
                actionHref={action.href}
                showPrice
              />
            );
          })}
        </div>
      )}
    </>
  );
}
