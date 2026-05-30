'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteVehicle } from '@/app/actions/vehicles'

interface DeleteVehicleButtonProps {
  vehicleId: string
  registration: string
}

export function DeleteVehicleButton({ vehicleId, registration }: DeleteVehicleButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete vehicle "${registration}"?`)) return

    setLoading(true)
    try {
      await deleteVehicle(vehicleId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" disabled={loading} onClick={handleDelete}>
      {loading ? 'Deleting…' : 'Delete'}
    </Button>
  )
}
