'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createBooking } from '@/app/actions/bookings'
import { useRouter } from 'next/navigation'

interface BookingFormProps {
  packageId: string
  price: string
  duration: number
}

export function BookingForm({ packageId, price, duration }: BookingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    start_date: '',
    end_date: '',
    number_of_guests: 1,
    special_requests: '',
  })

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }
      
      if (name === 'start_date' && updated.start_date) {
        const startDate = new Date(updated.start_date)
        const endDate = new Date(startDate)
        endDate.setDate(endDate.getDate() + duration - 1)
        updated.end_date = endDate.toISOString().split('T')[0]
      }
      
      return updated
    })
  }

  const handleGuestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const guests = Math.max(1, parseInt(e.target.value) || 1)
    setFormData(prev => ({ ...prev, number_of_guests: guests }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!formData.start_date || !formData.end_date) {
        setError('Please select travel dates')
        setLoading(false)
        return
      }

      const totalPrice = (parseFloat(price) * formData.number_of_guests).toFixed(2)

      const booking = await createBooking({
        package_id: packageId,
        start_date: formData.start_date,
        end_date: formData.end_date,
        number_of_guests: formData.number_of_guests,
        total_price: totalPrice,
        special_requests: formData.special_requests || undefined,
      })

      router.push(`/booking/${booking.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = (parseFloat(price) * formData.number_of_guests).toFixed(2)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={formData.start_date}
          onChange={handleDateChange}
          required
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">End Date</label>
        <input
          type="date"
          name="end_date"
          value={formData.end_date}
          disabled
          className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Auto-calculated based on package duration
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Number of Guests</label>
        <input
          type="number"
          value={formData.number_of_guests}
          onChange={handleGuestChange}
          min="1"
          max="20"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Special Requests (Optional)</label>
        <textarea
          name="special_requests"
          value={formData.special_requests}
          onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
          placeholder="Any special accommodations or preferences?"
          rows={3}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="bg-secondary/30 p-4 rounded-lg">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-muted-foreground">Price per person:</span>
          <span className="text-lg font-semibold">KES {price}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold">Total ({formData.number_of_guests} {formData.number_of_guests === 1 ? 'guest' : 'guests'}):</span>
          <span className="text-2xl font-bold text-primary">KES {totalPrice}</span>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? 'Processing...' : 'Continue to Payment'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By booking, you agree to our terms and conditions
      </p>
    </form>
  )
}
