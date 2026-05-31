import {
  getBookingById,
  getBookingDriverAssignment,
} from '@/app/actions/bookings'
import { getPaymentByBookingId } from '@/app/actions/payments'
import { getUserId } from '@/app/actions/auth'
import { notFound, redirect } from 'next/navigation'
import { BookingTripView } from '@/components/customer/booking-trip-view'

interface BookingDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function BookingDetail({ params }: BookingDetailPageProps) {
  const { id } = await params
  const userId = await getUserId().catch(() => null)

  if (!userId) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/booking/${id}`)}`)
  }

  const booking = await getBookingById(id)

  if (!booking) {
    notFound()
  }

  const payment = await getPaymentByBookingId(id)
  const status = booking.status ?? 'pending'

  const driverAssignment =
    status === 'confirmed' || status === 'completed'
      ? await getBookingDriverAssignment(id)
      : null

  const headerCopy = {
    pending: {
      title: 'Review your booking',
      description: 'Confirm your details, then complete payment to secure your spot.',
    },
    paid: {
      title: 'Payment submitted',
      description: 'Our team is verifying your payment. You will be notified once confirmed.',
    },
    confirmed: {
      title: 'Booking confirmed',
      description: 'Your safari is confirmed. Meet your guide below before departure.',
    },
    cancelled: {
      title: 'Booking cancelled',
      description: 'This booking has been cancelled.',
    },
    completed: {
      title: 'Safari completed',
      description: 'Thank you for travelling with Safari Adventures.',
    },
  }[status] ?? {
    title: 'Booking details',
    description: 'Review your safari booking information.',
  }

  return (
    <BookingTripView
      booking={booking}
      payment={payment ?? null}
      driverAssignment={driverAssignment}
      headerTitle={headerCopy.title}
      headerDescription={headerCopy.description}
      showStepper
    />
  )
}
