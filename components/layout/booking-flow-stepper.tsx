'use client'

import { usePathname } from 'next/navigation'
import { TripStepper, BOOKING_FLOW_STEPS } from '@/components/safari/trip-stepper'

export function BookingFlowStepper() {
  const pathname = usePathname()

  const isPayment = pathname.endsWith('/payment')
  const isSuccess = pathname.endsWith('/success')

  const currentStepId = isPayment || isSuccess ? 'pay' : 'book'

  return (
    <div className="border-b border-border/80 bg-card/30 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <TripStepper steps={BOOKING_FLOW_STEPS} currentStepId={currentStepId} />
      </div>
    </div>
  )
}
