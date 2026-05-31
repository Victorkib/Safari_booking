import { BookingForm } from '@/components/booking-form'
import { ShieldCheck, Smartphone } from 'lucide-react'
import Link from 'next/link'

interface PackageBookingPanelProps {
  packageId: string
  title: string
  price: string
  durationDays: number
  groupSizeMin: number
  groupSizeMax: number
  isSignedIn: boolean
  signInHref: string
  userRole?: string | null
}

export function PackageBookingPanel({
  packageId,
  title,
  price,
  durationDays,
  groupSizeMin,
  groupSizeMax,
  isSignedIn,
  signInHref,
  userRole,
}: PackageBookingPanelProps) {
  return (
    <div className="sticky top-24 space-y-4">
      <div className="overflow-hidden rounded-2xl border border-secondary/25 bg-gradient-to-br from-card via-card to-secondary/5 shadow-lg">
        <div className="border-b border-border/60 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-secondary">
            Reserve your safari
          </p>
          <p className="font-display mt-1 text-lg font-semibold leading-snug">{title}</p>
        </div>
        <div className="p-5">
          <BookingForm
            packageId={packageId}
            price={price}
            durationDays={durationDays}
            groupSizeMin={groupSizeMin}
            groupSizeMax={groupSizeMax}
            isSignedIn={isSignedIn}
            signInHref={signInHref}
            userRole={userRole}
          />
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/80 p-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <Smartphone className="mt-0.5 size-4 shrink-0 text-secondary" />
          <p>M-Pesa STK Push and manual payment options available at checkout.</p>
        </div>
        <div className="mt-3 flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          <p>
            Read our{' '}
            <Link href="/booking-policy" className="font-medium text-foreground underline-offset-4 hover:underline">
              booking policy
            </Link>{' '}
            before you travel.
          </p>
        </div>
      </div>
    </div>
  )
}
