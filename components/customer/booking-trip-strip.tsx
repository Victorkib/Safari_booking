import Image from 'next/image'
import { getPackageImageUrl } from '@/lib/safari-images'
import { formatDateRange } from '@/lib/booking-dates'
import { getBookingStatusLabel, getBookingStatusStyles } from '@/lib/booking-status'

interface BookingTripStripProps {
  packageId: string
  packageTitle?: string | null
  startDate: string
  endDate: string
  numberOfGuests: number
  totalPrice: string
  status?: string | null
}

export function BookingTripStrip({
  packageId,
  packageTitle,
  startDate,
  endDate,
  numberOfGuests,
  totalPrice,
  status,
}: BookingTripStripProps) {
  return (
    <div className="mb-6 flex gap-4 overflow-hidden rounded-xl border border-border/80 bg-card">
      <div className="relative hidden h-auto w-28 shrink-0 sm:block sm:w-36">
        <Image
          src={getPackageImageUrl(packageId)}
          alt={packageTitle ?? 'Trip'}
          fill
          className="object-cover"
          sizes="144px"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getBookingStatusStyles(status)}`}
          >
            {getBookingStatusLabel(status)}
          </span>
        </div>
        <p className="font-display mt-1 font-semibold">{packageTitle ?? 'Safari booking'}</p>
        <p className="text-sm text-muted-foreground">
          {formatDateRange(startDate, endDate)} · {numberOfGuests} guest
          {numberOfGuests !== 1 ? 's' : ''}
        </p>
        <p className="mt-1 font-display text-lg font-semibold text-primary">
          KES {parseFloat(totalPrice).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
