'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createBooking } from '@/app/actions/bookings'
import {
  computeEndDateFromStart,
  formatDateLong,
  todayDateString,
  tripDayCount,
} from '@/lib/booking-dates'
import { CalendarDays, LogIn, Users } from 'lucide-react'

interface BookingFormProps {
  packageId: string
  price: string
  durationDays: number
  groupSizeMin: number
  groupSizeMax: number
  isSignedIn: boolean
  signInHref: string
  userRole?: string | null
}

export function BookingForm({
  packageId,
  price,
  durationDays,
  groupSizeMin,
  groupSizeMax,
  isSignedIn,
  signInHref,
  userRole,
}: BookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [numberOfGuests, setNumberOfGuests] = useState(groupSizeMin)
  const [specialRequests, setSpecialRequests] = useState('')

  const endDate = useMemo(() => {
    if (!startDate) return ''
    return computeEndDateFromStart(startDate, durationDays)
  }, [startDate, durationDays])

  const totalPrice = (parseFloat(price) * numberOfGuests).toFixed(2)
  const minDate = todayDateString()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSignedIn) return

    setLoading(true)
    setError('')

    try {
      if (!startDate) {
        setError('Please select a departure date')
        setLoading(false)
        return
      }

      const booking = await createBooking({
        package_id: packageId,
        start_date: startDate,
        number_of_guests: numberOfGuests,
        special_requests: specialRequests.trim() || undefined,
      })

      router.push(`/booking/${booking.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  if (userRole === 'driver') {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-center text-sm text-amber-900">
        <p className="font-medium">Driver accounts cannot book safaris</p>
        <p className="mt-2 text-muted-foreground">
          Use the driver portal to view assigned tours.
        </p>
      </div>
    )
  }

  if (userRole === 'admin') {
    return (
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 text-center text-sm">
        <p className="font-medium">Administrator booking</p>
        <p className="mt-2 text-muted-foreground">
          Create bookings on behalf of customers from the admin console — you cannot book as a customer yourself.
        </p>
        <Button asChild className="mt-4 w-full">
          <Link href="/admin/bookings/new">Create booking for customer</Link>
        </Button>
        <Button asChild variant="outline" className="mt-2 w-full">
          <Link href="/packages">Browse packages (preview only)</Link>
        </Button>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="space-y-4 rounded-lg border border-secondary/30 bg-secondary/5 p-5 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to reserve your dates and complete your safari booking.
        </p>
        <Button asChild className="w-full">
          <Link href={signInHref}>
            <LogIn className="mr-2 size-4" />
            Sign in to book
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          New here?{' '}
          <Link
            href={signInHref.includes('/sign-in') ? signInHref.replace('/sign-in', '/sign-up') : '/sign-up'}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="start_date" className="flex items-center gap-2">
          <CalendarDays className="size-4 text-secondary" />
          Departure date
        </Label>
        <Input
          id="start_date"
          type="date"
          name="start_date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          min={minDate}
        />
        {endDate && (
          <p className="text-xs text-muted-foreground">
            {durationDays} days · ends {formatDateLong(endDate)} (
            {tripDayCount(startDate, endDate)} day trip)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests" className="flex items-center gap-2">
          <Users className="size-4 text-secondary" />
          Number of guests
        </Label>
        <Input
          id="guests"
          type="number"
          value={numberOfGuests}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10)
            if (!Number.isNaN(n)) {
              setNumberOfGuests(Math.min(groupSizeMax, Math.max(groupSizeMin, n)))
            }
          }}
          min={groupSizeMin}
          max={groupSizeMax}
          required
        />
        <p className="text-xs text-muted-foreground">
          This package accepts {groupSizeMin}–{groupSizeMax} guests
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="special_requests">Special requests (optional)</Label>
        <Textarea
          id="special_requests"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder="Dietary needs, accessibility, celebration, etc."
          rows={3}
        />
      </div>

      <div className="rounded-lg border border-border/80 bg-muted/30 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Price per person</span>
          <span className="font-semibold">KES {parseFloat(price).toLocaleString()}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border/80 pt-2">
          <span className="font-medium">
            Total ({numberOfGuests} {numberOfGuests === 1 ? 'guest' : 'guests'})
          </span>
          <span className="font-display text-xl font-semibold text-primary">
            KES {parseFloat(totalPrice).toLocaleString()}
          </span>
        </div>
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading || !startDate} className="w-full" size="lg">
        {loading ? 'Creating booking…' : 'Review booking'}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By booking you agree to our{' '}
        <Link href="/terms" className="underline-offset-4 hover:underline">
          terms
        </Link>
        ,{' '}
        <Link href="/booking-policy" className="underline-offset-4 hover:underline">
          booking policy
        </Link>
        , and{' '}
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          privacy policy
        </Link>
        .
      </p>
    </form>
  )
}
