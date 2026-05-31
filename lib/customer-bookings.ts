import { compareDateStrings, todayDateString } from '@/lib/booking-dates'
import type { BookingFilter } from '@/components/customer/booking-filter-tabs'

export type CustomerBookingRow = {
  id: string
  package_id: string
  package_title?: string | null
  package_destinations?: string[] | null
  start_date: string
  end_date: string
  number_of_guests: number
  total_price: string
  status?: string | null
}

export function filterCustomerBookings(
  bookings: CustomerBookingRow[],
  filter: BookingFilter
): CustomerBookingRow[] {
  const today = todayDateString()

  switch (filter) {
    case 'pending':
      return bookings.filter((b) => b.status === 'pending')
    case 'cancelled':
      return bookings.filter((b) => b.status === 'cancelled')
    case 'upcoming':
      return bookings.filter(
        (b) =>
          b.status !== 'cancelled' && compareDateStrings(b.end_date, today) >= 0
      )
    case 'past':
      return bookings.filter(
        (b) => compareDateStrings(b.end_date, today) < 0 && b.status !== 'cancelled'
      )
    default:
      return bookings
  }
}
