import { BookingJourneyShell } from '@/components/layout/booking-journey-shell'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({
  title: 'Complete Booking',
  path: '/booking',
  noIndex: true,
})

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BookingJourneyShell>{children}</BookingJourneyShell>
}
