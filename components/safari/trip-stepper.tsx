import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

export type TripStep = {
  id: string
  label: string
  description?: string
}

interface TripStepperProps {
  steps: TripStep[]
  currentStepId: string
  className?: string
}

export function TripStepper({ steps, currentStepId, className }: TripStepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId)

  return (
    <ol className={cn('flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0', className)}>
      {steps.map((step, index) => {
        const isComplete = index < currentIndex
        const isCurrent = step.id === currentStepId

        return (
          <li
            key={step.id}
            className={cn(
              'relative flex flex-1 flex-col sm:items-center sm:text-center',
              index < steps.length - 1 && 'sm:pb-0'
            )}
          >
            <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  isComplete && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-secondary bg-secondary/15 text-secondary-foreground ring-2 ring-secondary/30',
                  !isComplete && !isCurrent && 'border-border bg-muted text-muted-foreground'
                )}
              >
                {isComplete ? <Check className="size-4" /> : index + 1}
              </div>
              <div className="min-w-0 pb-6 sm:pb-0">
                <p
                  className={cn(
                    'text-sm font-semibold',
                    isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'absolute left-[1.125rem] top-9 hidden h-full w-px sm:left-1/2 sm:top-5 sm:block sm:h-px sm:w-full sm:-translate-x-1/2',
                  isComplete ? 'bg-primary' : 'bg-border'
                )}
                aria-hidden
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}

export const BOOKING_FLOW_STEPS: TripStep[] = [
  { id: 'book', label: 'Book', description: 'Dates & guests' },
  { id: 'pay', label: 'Pay', description: 'Secure payment' },
  { id: 'confirm', label: 'Confirm', description: 'Trip locked in' },
]

export function bookingStatusToStepId(status: string | null | undefined): string {
  switch (status) {
    case 'pending':
      return 'book'
    case 'paid':
      return 'pay'
    case 'confirmed':
    case 'completed':
      return 'confirm'
    default:
      return 'book'
  }
}
