import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getPackageImageUrl } from '@/lib/safari-images'
import { getBookingStatusLabel, getBookingStatusStyles } from '@/lib/booking-status'
import { cn } from '@/lib/utils'
import { Calendar, ChevronRight, Users } from 'lucide-react'

export type TripCardData = {
  id: string
  package_id?: string
  package_title?: string | null
  destinations?: string[] | null
  start_date: string
  end_date: string
  number_of_guests: number
  total_price?: string
  status?: string | null
  imageUrl?: string
}

interface TripCardProps {
  trip: TripCardData
  href: string
  actionLabel?: string
  actionHref?: string
  showPrice?: boolean
  variant?: 'customer' | 'driver'
  className?: string
}

function formatDateRange(start: string, end: string) {
  const s = new Date(`${start}T00:00:00`)
  const e = new Date(`${end}T00:00:00`)
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return `${s.toLocaleDateString('en-KE', opts)} – ${e.toLocaleDateString('en-KE', opts)}`
}

export function TripCard({
  trip,
  href,
  actionLabel = 'View details',
  actionHref,
  showPrice = false,
  variant = 'customer',
  className,
}: TripCardProps) {
  const imageUrl =
    trip.imageUrl ?? getPackageImageUrl(trip.package_id, trip.destinations as string[] | null)
  const status = trip.status ?? 'pending'

  return (
    <article
      className={cn(
        'group overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-lg',
        className
      )}
    >
      <Link href={href} className="relative block aspect-[16/7] overflow-hidden sm:aspect-[21/8]">
          <Image
            src={imageUrl}
            alt={trip.package_title ?? 'Safari trip'}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <span
              className={cn(
                'inline-block rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm',
                getBookingStatusStyles(status)
              )}
            >
              {getBookingStatusLabel(status)}
            </span>
          </div>
        </Link>

      <div className="p-5">
        <Link href={href}>
          <h3 className="font-display text-xl font-semibold tracking-tight text-foreground group-hover:text-primary">
            {trip.package_title ?? (variant === 'driver' ? 'Assigned tour' : 'Safari booking')}
          </h3>
        </Link>
        <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
          Ref {trip.id.slice(0, 8)}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4 text-secondary" />
            {formatDateRange(trip.start_date, trip.end_date)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-secondary" />
            {trip.number_of_guests} guest{trip.number_of_guests !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/80 pt-4">
          {showPrice && trip.total_price ? (
            <p className="font-display text-lg font-semibold text-primary">
              KES {parseFloat(trip.total_price).toLocaleString()}
            </p>
          ) : (
            <span />
          )}
          <Button asChild size="sm" variant={status === 'pending' ? 'default' : 'outline'}>
            <Link href={actionHref ?? href}>
              {actionLabel}
              <ChevronRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
