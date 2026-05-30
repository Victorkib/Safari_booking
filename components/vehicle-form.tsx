'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createVehicle, updateVehicle, type VehicleInput } from '@/app/actions/vehicles'

interface VehicleFormProps {
  initialData?: VehicleInput & { id?: string }
}

export function VehicleForm({ initialData }: VehicleFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    registration_number: initialData?.registration_number ?? '',
    vehicle_type: initialData?.vehicle_type ?? '4x4',
    make_model: initialData?.make_model ?? '',
    seating_capacity: initialData?.seating_capacity ?? 7,
    license_expiry: initialData?.license_expiry ?? '',
    insurance_expiry: initialData?.insurance_expiry ?? '',
    status: initialData?.status ?? 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload: VehicleInput = {
      registration_number: form.registration_number,
      vehicle_type: form.vehicle_type,
      make_model: form.make_model,
      seating_capacity: form.seating_capacity,
      license_expiry: form.license_expiry || undefined,
      insurance_expiry: form.insurance_expiry || undefined,
      status: form.status,
    }

    try {
      if (isEditing && initialData?.id) {
        await updateVehicle(initialData.id, payload)
      } else {
        await createVehicle(payload)
      }
      router.push('/admin/vehicles')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div>
        <label className="block text-sm font-semibold mb-2">Registration Number *</label>
        <input
          value={form.registration_number}
          onChange={(e) => setForm((f) => ({ ...f, registration_number: e.target.value }))}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Vehicle Type *</label>
        <select
          value={form.vehicle_type}
          onChange={(e) => setForm((f) => ({ ...f, vehicle_type: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="4x4">4x4 Safari Land Cruiser</option>
          <option value="minibus">Minibus</option>
          <option value="van">Van</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Make & Model *</label>
        <input
          value={form.make_model}
          onChange={(e) => setForm((f) => ({ ...f, make_model: e.target.value }))}
          required
          placeholder="Toyota Land Cruiser V8"
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Seating Capacity *</label>
        <input
          type="number"
          min={2}
          max={30}
          value={form.seating_capacity}
          onChange={(e) => setForm((f) => ({ ...f, seating_capacity: parseInt(e.target.value) || 7 }))}
          required
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">License Expiry</label>
          <input
            type="date"
            value={form.license_expiry}
            onChange={(e) => setForm((f) => ({ ...f, license_expiry: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Insurance Expiry</label>
          <input
            type="date"
            value={form.insurance_expiry}
            onChange={(e) => setForm((f) => ({ ...f, insurance_expiry: e.target.value }))}
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Status</label>
        <select
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
          className="w-full px-3 py-2 border border-border rounded-md bg-background"
        >
          <option value="active">Active</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">{error}</div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Saving…' : isEditing ? 'Update Vehicle' : 'Create Vehicle'}
      </Button>
    </form>
  )
}
