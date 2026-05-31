'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createBookingForCustomer } from '@/app/actions/bookings'
import {
  computeEndDateFromStart,
  formatDateLong,
  todayDateString,
  tripDayCount,
} from '@/lib/booking-dates'

type Customer = { id: string; name: string; email: string }
type PackageOption = {
  id: string
  title: string
  price: string
  duration_days: number
  group_size_min: number | null
  group_size_max: number | null
}

interface AdminBookingFormProps {
  customers: Customer[]
  packages: PackageOption[]
}

export function AdminBookingForm({ customers, packages }: AdminBookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [customerUserId, setCustomerUserId] = useState('')
  const [packageId, setPackageId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState('')

  const selectedPackage = packages.find((p) => p.id === packageId)
  const minGuests = selectedPackage?.group_size_min ?? 1
  const maxGuests = selectedPackage?.group_size_max ?? 20

  const endDate = useMemo(() => {
    if (!startDate || !selectedPackage) return ''
    return computeEndDateFromStart(startDate, selectedPackage.duration_days)
  }, [startDate, selectedPackage])

  const totalPrice = selectedPackage
    ? (parseFloat(selectedPackage.price) * guests).toFixed(2)
    : '0'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!customerUserId || !packageId || !startDate) {
        throw new Error('Customer, package, and departure date are required')
      }

      const booking = await createBookingForCustomer({
        customerUserId,
        package_id: packageId,
        start_date: startDate,
        number_of_guests: guests,
        special_requests: specialRequests.trim() || undefined,
      })

      router.push(`/admin/bookings/${booking.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label>Customer</Label>
        <Select value={customerUserId} onValueChange={setCustomerUserId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.email})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Safari package</Label>
        <Select
          value={packageId}
          onValueChange={(v) => {
            setPackageId(v)
            const pkg = packages.find((p) => p.id === v)
            if (pkg) setGuests(pkg.group_size_min ?? 1)
          }}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select package" />
          </SelectTrigger>
          <SelectContent>
            {packages.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title} — KES {parseFloat(p.price).toLocaleString()} / person
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Departure date</Label>
        <Input
          id="start_date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          min={todayDateString()}
          required
        />
        {endDate && (
          <p className="text-xs text-muted-foreground">
            Ends {formatDateLong(endDate)} ({tripDayCount(startDate, endDate)} days)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="guests">Guests</Label>
        <Input
          id="guests"
          type="number"
          min={minGuests}
          max={maxGuests}
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value, 10) || minGuests)}
          required
        />
        {selectedPackage && (
          <p className="text-xs text-muted-foreground">
            Allowed: {minGuests}–{maxGuests} guests
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Special requests</Label>
        <Textarea
          id="notes"
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          rows={3}
        />
      </div>

      {selectedPackage && (
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Total for customer</p>
          <p className="font-display text-2xl font-semibold text-primary">
            KES {parseFloat(totalPrice).toLocaleString()}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading ? 'Creating booking…' : 'Create booking for customer'}
      </Button>
    </form>
  )
}
