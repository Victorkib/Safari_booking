import { getBookingById } from '@/app/actions/bookings'
import { getUserId } from '@/app/actions/auth'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PaymentForm } from '@/components/payment-form'

interface PaymentPageProps {
  params: { id: string }
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const userId = await getUserId().catch(() => null)

  if (!userId) {
    redirect('/sign-in')
  }

  const booking = await getBookingById(params.id)

  if (!booking) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Complete Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Payment Method Cards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">M-Pesa</CardTitle>
              <CardDescription>Mobile Money</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Quick and secure payment via M-Pesa
              </p>
              <Button variant="outline" className="w-full">Select</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Credit Card</CardTitle>
              <CardDescription>Visa, Mastercard</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                International card payment
              </p>
              <Button variant="outline" className="w-full">Select</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Bank Transfer</CardTitle>
              <CardDescription>Direct deposit</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Wire transfer or bank account
              </p>
              <Button variant="outline" className="w-full">Select</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>
                  Enter your payment information below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentForm bookingId={booking.id} amount={booking.total_price} />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Ref</p>
                  <p className="font-mono text-sm font-semibold">{booking.id.slice(0, 12)}...</p>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-semibold">{booking.number_of_guests}</span>
                  </div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="text-muted-foreground">Per person:</span>
                    <span className="font-semibold">
                      KES {(parseFloat(booking.total_price) / booking.number_of_guests).toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold">Total Due:</span>
                    <span className="text-2xl font-bold text-primary">
                      KES {booking.total_price}
                    </span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-green-800">
                    ✓ Secure payment processed by industry-leading payment provider
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            🔒 Your payment information is secure and encrypted
          </p>
          <p>
            By completing this payment, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">
              terms and conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
