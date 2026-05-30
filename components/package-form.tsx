'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  createPackage,
  updatePackage,
  type PackageInput,
} from '@/app/actions/packages'

interface PackageFormProps {
  initialData?: PackageInput & { id?: string }
}

export function PackageForm({ initialData }: PackageFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialData?.id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    duration_days: initialData?.duration_days ?? 3,
    price: initialData?.price ?? '',
    difficulty_level: initialData?.difficulty_level ?? 'easy',
    group_size_min: initialData?.group_size_min ?? 2,
    group_size_max: initialData?.group_size_max ?? 8,
    destinations: (initialData?.destinations ?? []).join(', '),
    highlights: (initialData?.highlights ?? []).join('\n'),
    included_services: (initialData?.included_services ?? []).join('\n'),
    excluded_items: (initialData?.excluded_items ?? []).join('\n'),
    status: initialData?.status ?? 'active',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload: PackageInput = {
      title: form.title,
      description: form.description || undefined,
      duration_days: form.duration_days,
      price: form.price,
      difficulty_level: form.difficulty_level,
      group_size_min: form.group_size_min,
      group_size_max: form.group_size_max,
      destinations: form.destinations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      highlights: form.highlights.split('\n').map((s) => s.trim()).filter(Boolean),
      included_services: form.included_services
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      excluded_items: form.excluded_items
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      status: form.status,
    }

    try {
      if (isEditing && initialData?.id) {
        await updatePackage(initialData.id, payload)
        router.push('/admin/packages')
      } else {
        await createPackage(payload)
        router.push('/admin/packages')
      }
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save package')
    } finally {
      setLoading(false)
    }
  }

  const field = (
    label: string,
    children: React.ReactNode
  ) => (
    <div>
      <label className="block text-sm font-semibold mb-2">{label}</label>
      {children}
    </div>
  )

  const inputClass =
    'w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {field(
        'Title',
        <input
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className={inputClass}
        />
      )}

      {field(
        'Description',
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className={inputClass}
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        {field(
          'Duration (days)',
          <input
            type="number"
            min={1}
            required
            value={form.duration_days}
            onChange={(e) =>
              setForm({ ...form, duration_days: parseInt(e.target.value) || 1 })
            }
            className={inputClass}
          />
        )}
        {field(
          'Price (KES)',
          <input
            required
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="85000.00"
            className={inputClass}
          />
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {field(
          'Difficulty',
          <select
            value={form.difficulty_level}
            onChange={(e) => setForm({ ...form, difficulty_level: e.target.value })}
            className={inputClass}
          >
            <option value="easy">Easy</option>
            <option value="moderate">Moderate</option>
            <option value="challenging">Challenging</option>
          </select>
        )}
        {field(
          'Min group',
          <input
            type="number"
            min={1}
            value={form.group_size_min}
            onChange={(e) =>
              setForm({ ...form, group_size_min: parseInt(e.target.value) || 1 })
            }
            className={inputClass}
          />
        )}
        {field(
          'Max group',
          <input
            type="number"
            min={1}
            value={form.group_size_max}
            onChange={(e) =>
              setForm({ ...form, group_size_max: parseInt(e.target.value) || 1 })
            }
            className={inputClass}
          />
        )}
      </div>

      {field(
        'Destinations (comma-separated)',
        <input
          value={form.destinations}
          onChange={(e) => setForm({ ...form, destinations: e.target.value })}
          placeholder="Maasai Mara, Amboseli"
          className={inputClass}
        />
      )}

      {field(
        'Highlights (one per line)',
        <textarea
          rows={4}
          value={form.highlights}
          onChange={(e) => setForm({ ...form, highlights: e.target.value })}
          className={inputClass}
        />
      )}

      {field(
        'Included services (one per line)',
        <textarea
          rows={4}
          value={form.included_services}
          onChange={(e) => setForm({ ...form, included_services: e.target.value })}
          className={inputClass}
        />
      )}

      {field(
        'Excluded items (one per line)',
        <textarea
          rows={3}
          value={form.excluded_items}
          onChange={(e) => setForm({ ...form, excluded_items: e.target.value })}
          className={inputClass}
        />
      )}

      {field(
        'Status',
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className={inputClass}
        >
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
