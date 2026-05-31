import { BookingJourneyShell } from '@/components/layout/booking-journey-shell'

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <BookingJourneyShell>{children}</BookingJourneyShell>
}
