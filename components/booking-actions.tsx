'use client'

import { assignDriverToBooking, updateBookingStatus } from '@/app/actions/bookings'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BookingActionsProps {
  bookingId: string
  currentStatus: string | null
  currentDriverId: string | null
  drivers: { id: string; name: string }[]
}

export function BookingActions({
  bookingId,
  currentStatus,
  currentDriverId,
  drivers,
}: BookingActionsProps) {
  const router = useRouter()
  const [driverId, setDriverId] = useState(currentDriverId ?? '')
  const [loading, setLoading] = useState(false)

  const status = currentStatus ?? 'pending'

  const handleStatus = async (next: 'confirmed' | 'cancelled' | 'completed') => {
    setLoading(true)
    try {
      await updateBookingStatus(bookingId, next)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignDriver = async () => {
    if (!driverId) return
    setLoading(true)
    try {
      await assignDriverToBooking(bookingId, driverId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Assignment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {status === 'paid' && (
        <>
          <Button size="sm" disabled={loading} onClick={() => handleStatus('confirmed')}>
            Confirm
          </Button>
          <Button size="sm" variant="destructive" disabled={loading} onClick={() => handleStatus('cancelled')}>
            Cancel
          </Button>
        </>
      )}
      {status === 'pending' && (
        <Button size="sm" variant="destructive" disabled={loading} onClick={() => handleStatus('cancelled')}>
          Cancel
        </Button>
      )}
      {status === 'confirmed' && (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => handleStatus('completed')}>
          Mark Complete
        </Button>
      )}
      {(status === 'confirmed' || status === 'completed') && (
        <>
          <select
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            className="text-sm px-2 py-1 border border-border rounded-md bg-background"
          >
            <option value="">Assign driver...</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <Button size="sm" variant="outline" disabled={loading || !driverId} onClick={handleAssignDriver}>
            Assign
          </Button>
        </>
      )}
    </div>
  )
}
