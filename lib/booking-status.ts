export const BOOKING_STATUSES = [
  'pending',
  'paid',
  'confirmed',
  'cancelled',
  'completed',
] as const

export type BookingStatus = (typeof BOOKING_STATUSES)[number]

export const PAYMENT_STATUSES = [
  'pending',
  'completed',
  'failed',
  'refunded',
] as const

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export function isBookingStatus(value: string): value is BookingStatus {
  return (BOOKING_STATUSES as readonly string[]).includes(value)
}

export function getBookingStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case 'pending':
      return 'Awaiting Payment'
    case 'paid':
      return 'Payment Pending Verification'
    case 'confirmed':
      return 'Confirmed'
    case 'cancelled':
      return 'Cancelled'
    case 'completed':
      return 'Completed'
    default:
      return 'Unknown'
  }
}

export function getBookingStatusStyles(status: string | null | undefined): string {
  switch (status) {
    case 'confirmed':
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'paid':
      return 'bg-blue-100 text-blue-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function canSubmitPayment(status: string | null | undefined): boolean {
  return status === 'pending'
}

export function canAccessPaymentPage(status: string | null | undefined): boolean {
  return status === 'pending'
}
