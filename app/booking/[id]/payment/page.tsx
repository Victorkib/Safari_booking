import { getBookingWithPayment } from '@/app/actions/bookings'
import { getUserId } from '@/app/actions/auth'
import { isMpesaLive } from '@/app/actions/payments'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/payment-form'
import { BookingTripStrip } from '@/components/customer/booking-trip-strip'
import { CustomerPageHeader } from '@/components/layout/customer-page-header'

interface PaymentPageProps {
  params: Promise<{ id: string }>
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { id } = await params
  const userId = await getUserId().catch(() => null)

  if (!userId) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(`/booking/${id}/payment`)}`)
  }

  const data = await getBookingWithPayment(id)

  if (!data) {
    notFound()
  }

  if (data.booking.status !== 'pending') {
    redirect(`/booking/${id}`)
  }

  const b = data.booking
  const mpesaLive = await isMpesaLive()

  return (
    <>
      <CustomerPageHeader
        eyebrow="Secure checkout"
        title="Complete payment"
        description={
          mpesaLive
            ? 'Pay with M-Pesa STK Push for instant confirmation, or choose another method for manual verification.'
            : 'Submit your payment details. Our team will verify and confirm your booking.'
        }
      />

      <BookingTripStrip
        packageId={b.package_id}
        packageTitle={b.package_title}
        startDate={b.start_date}
        endDate={b.end_date}
        numberOfGuests={b.number_of_guests}
        totalPrice={b.total_price}
        status={b.status}
      />

      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="font-display text-lg">Payment details</CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentForm bookingId={b.id} amount={b.total_price} mpesaLive={mpesaLive} />
        </CardContent>
      </Card>
    </>
  )
}
