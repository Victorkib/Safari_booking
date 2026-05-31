'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export type BookingFilter =
  | 'all'
  | 'pending'
  | 'upcoming'
  | 'past'
  | 'cancelled'

const FILTERS: { id: BookingFilter; label: string }[] = [
  { id: 'all', label: 'All trips' },
  { id: 'pending', label: 'Awaiting payment' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
  { id: 'cancelled', label: 'Cancelled' },
]

interface BookingFilterTabsProps {
  active: BookingFilter
}

export function BookingFilterTabs({ active }: BookingFilterTabsProps) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {FILTERS.map((f) => (
        <Link
          key={f.id}
          href={f.id === 'all' ? '/customer-dashboard' : `/customer-dashboard?filter=${f.id}`}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium transition-colors',
            active === f.id
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          {f.label}
        </Link>
      ))}
    </div>
  )
}
