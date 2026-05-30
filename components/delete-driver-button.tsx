'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteDriver } from '@/app/actions/drivers'

interface DeleteDriverButtonProps {
  driverId: string
  driverName: string
}

export function DeleteDriverButton({ driverId, driverName }: DeleteDriverButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Remove driver profile for "${driverName}"?`)) return

    setLoading(true)
    try {
      await deleteDriver(driverId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" disabled={loading} onClick={handleDelete}>
      {loading ? 'Removing…' : 'Remove'}
    </Button>
  )
}
