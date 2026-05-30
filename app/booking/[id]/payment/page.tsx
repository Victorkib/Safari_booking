import { getBookingWithPayment } from '@/app/actions/bookings'
import { getUserId } from '@/app/actions/auth'
import { isMpesaLive } from '@/app/actions/payments'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/payment-form'
import { PageHeader } from '@/components/layout/page-header'

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
      <PageHeader
        title="Complete payment"
        description={
          mpesaLive
            ? 'Pay with M-Pesa STK Push for instant confirmation, or choose another method for manual verification.'
            : 'Submit your payment details. Our team will verify and confirm your booking.'
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border-border/80 shadow-sm">
            <CardHeader>
              <CardTitle className="font-display text-lg">Payment details</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm bookingId={b.id} amount={b.total_price} mpesaLive={mpesaLive} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-8 border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
            <CardHeader>
              <CardTitle className="font-display text-lg">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {b.package_title && (
                <div>
                  <p className="text-sm text-muted-foreground">Package</p>
                  <p className="font-semibold">{b.package_title}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Booking ref</p>
                <p className="font-mono text-sm font-semibold">{b.id.slice(0, 12)}…</p>
              </div>
              <div className="space-y-2 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-semibold">{b.number_of_guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Total due</span>
                  <span className="font-display text-xl font-semibold text-primary">
                    KES {parseFloat(b.total_price).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
