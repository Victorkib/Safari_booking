'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createDriver, updateDriver } from '@/app/actions/drivers'

type DriverUser = { id: string; name: string; email: string }
type VehicleOption = { id: string; registration_number: string; make_model: string }

interface DriverFormProps {
  eligibleUsers: DriverUser[]
  vehicles: VehicleOption[]
  initialData?: {
    id: string
    userId: string
    license_number: string
    license_expiry: string
    experience_years: number | null
    vehicle_id: string | null
    status: string | null
    name: string
    email: string
  }
}

export function DriverForm({ eligibleUsers, vehicles, initialData }: DriverFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    userId: initialData?.userId ?? '',
    license_number: initialData?.license_number ?? '',
    license_expiry: initialData?.license_expiry ?? '',
    experience_years: initialData?.experience_years ?? 0,
    vehicle_id: initialData?.vehicle_id ?? '',
    status: initialData?.status ?? 'available',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        license_number: form.license_number,
        license_expiry: form.license_expiry,
        experience_years: form.experience_years || undefined,
        vehicle_id: form.vehicle_id || undefined,
        status: form.status,
      }

      if (isEditing && initialData?.id) {
        await updateDriver(initialData.id, {
          ...payload,
          vehicle_id: form.vehicle_id || null,
        })
      } else {
        if (!form.userId) {
          throw new Error('Select a user account for this driver')
        }
        await createDriver({ userId: form.userId, ...payload })
      }

      router.push('/admin/drivers')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save driver')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {isEditing ? (
        <div>
          <label className="block text-sm font-semibold mb-2">Linked Account</label>
          <p className="text-sm text-muted-foreground">
            {initialData?.name} ({initialData?.email})
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold mb-2">User Account *</label>
          <select
            value={form.userId}
            onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
            required
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          >
            <option value="">Select driver user…</option>
            {eligibleUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Only accounts with role &quot;driver&quot; without an existing profile appear here.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold mb-2">License Number *</label>
        <input
          value={form.license_number}
          onChange={(e) => setForm((f) => ({ ...f, license_number: e.target.value }))}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">License Expiry *</label>
        <input
          type="date"
          value={form.license_expiry}
          onChange={(e) => setForm((f) => ({ ...f, license_expiry: e.target.value }))}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Experience (years)</label>
        <input
          type="number"
          min={0}
          value={form.experience_years}
          onChange={(e) => setForm((f) => ({ ...f, experience_years: parseInt(e.target.value) || 0 }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Assigned Vehicle</label>
        <select
          value={form.vehicle_id}
          onChange={(e) => setForm((f) => ({ ...f, vehicle_id: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="">None</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.registration_number} — {v.make_model}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="available">Available</option>
          <option value="on_tour">On Tour</option>
          <option value="off_duty">Off Duty</option>
        </select>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">{error}</div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : isEditing ? 'Update Driver' : 'Create Driver'}
      </Button>
    </form>
  )
}
