import { getBookingByIdForDriver } from '@/app/actions/bookings'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface TourDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function TourDetail({ params }: TourDetailPageProps) {
  const { id } = await params
  const booking = await getBookingByIdForDriver(id)

  if (!booking) {
    notFound()
  }

  const startDate = new Date(booking.start_date)
  const endDate = new Date(booking.end_date)
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const isActive = startDate <= new Date() && new Date() <= endDate
  const isUpcoming = startDate > new Date()

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-foreground">
              Tour #{booking.id.slice(0, 8)}
            </h1>
            <div className="flex gap-2">
              {isActive && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  🔴 In Progress
                </span>
              )}
              {isUpcoming && (
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                  📅 Upcoming
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Start Date</p>
                    <p className="text-2xl font-bold">
                      {startDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {startDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">End Date</p>
                    <p className="text-2xl font-bold">
                      {endDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {days} days total
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
              <CardHeader>
                <CardTitle>Guest Information</CardTitle>
                <CardDescription>Safari group details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Number of Guests</p>
                    <p className="text-lg font-semibold">{booking.number_of_guests} person{booking.number_of_guests !== 1 ? 's' : ''}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
                    <p className="font-mono text-sm font-bold">{booking.id}</p>
                  </div>

                  {booking.special_requests && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">Special Requests</p>
                      <p className="text-foreground whitespace-pre-wrap">
                        {booking.special_requests}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tour Checklist */}
            <Card>
              <CardHeader>
                <CardTitle>Pre-Tour Checklist</CardTitle>
                <CardDescription>Prepare for your safari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded hover:bg-muted cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={false} />
                    <span className="text-sm">Vehicle inspected and fueled</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded hover:bg-muted cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={false} />
                    <span className="text-sm">Communication devices charged</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded hover:bg-muted cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={false} />
                    <span className="text-sm">First aid kit checked</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded hover:bg-muted cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={false} />
                    <span className="text-sm">Route planned and reviewed</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded hover:bg-muted cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={false} />
                    <span className="text-sm">Weather forecast checked</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded hover:bg-muted cursor-pointer">
                    <input type="checkbox" className="w-4 h-4" defaultChecked={false} />
                    <span className="text-sm">Guest contact info confirmed</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Daily Log */}
            <Card>
              <CardHeader>
                <CardTitle>Tour Log</CardTitle>
                <CardDescription>Document your safari experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    placeholder="Add daily notes about the tour..."
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                  <Button>Save Log Entry</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Package Info */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Tour Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Package ID</p>
                  <p className="font-mono text-sm">{booking.package_id.slice(0, 12)}...</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                  <p className="text-2xl font-bold text-primary">
                    KES {booking.total_price}
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-1">Booking Status</p>
                  <p className="font-semibold capitalize">{booking.status}</p>
                </div>

                <div className="pt-4 border-t border-border space-y-3">
                  <Button className="w-full" variant="outline">
                    📞 Contact Support
                  </Button>
                  <Button className="w-full" variant="outline">
                    📹 Submit Photos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Important Contacts */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Control Center</p>
                  <p className="font-semibold">+254 (0) 123 456 789</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground mb-1">Emergency Medical</p>
                  <p className="font-semibold">+254 (0) 999 888 777</p>
                </div>
                <div className="pt-3 border-t border-border">
                  <p className="text-muted-foreground mb-1">Support Email</p>
                  <p className="font-semibold text-xs">support@safariadventures.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/driver/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
