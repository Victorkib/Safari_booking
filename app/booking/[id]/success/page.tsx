import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface SuccessPageProps {
  params: { id: string }
}

export default function PaymentSuccess({ params }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Animation */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 animate-bounce">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Your safari adventure is confirmed and paid
          </p>
        </div>

        {/* Payment Confirmation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Transaction ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-mono font-bold text-primary">
                {params.id.slice(0, 16)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-semibold text-green-700">Completed</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What Happens Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Happens Next</CardTitle>
            <CardDescription>
              Here&apos;s your safari adventure timeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                    1
                  </div>
                  <div className="w-0.5 h-12 bg-border"></div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Confirmation Email (Today)</h4>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll receive a detailed confirmation with your booking details and pre-trip information
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                    2
                  </div>
                  <div className="w-0.5 h-12 bg-border"></div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Travel Documents (1 Week Before)</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive detailed itinerary, packing list, and travel tips from our guides
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-2">
                    3
                  </div>
                  <div className="w-0.5 h-12 bg-border"></div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Final Confirmation (2 Days Before)</h4>
                  <p className="text-sm text-muted-foreground">
                    Our team will call to confirm final details and answer any last-minute questions
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Your Safari Begins!</h4>
                  <p className="text-sm text-muted-foreground">
                    Meet your professional guide and start your unforgettable African adventure
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Support & Questions</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-900">
            <p className="mb-4">
              Our dedicated team is ready to help with any questions about your upcoming safari
            </p>
            <div className="space-y-2">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:support@safariadventures.com" className="text-blue-700 hover:underline">
                  support@safariadventures.com
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+254123456789" className="text-blue-700 hover:underline">
                  +254 (0) 123 456 789
                </a>
              </p>
              <p>
                <strong>Available:</strong> 24/7 for bookings and inquiries
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/customer-dashboard" className="flex-1">
            <Button size="lg" className="w-full">
              View My Bookings
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              Explore More Packages
            </Button>
          </Link>
        </div>

        {/* Invoice Download */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Need your invoice?
          </p>
          <Button variant="outline" className="gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Download Invoice
          </Button>
        </div>
      </div>
    </div>
  )
}
