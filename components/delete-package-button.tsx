'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deletePackage } from '@/app/actions/packages'

interface DeletePackageButtonProps {
  packageId: string
  packageTitle: string
}

export function DeletePackageButton({
  packageId,
  packageTitle,
}: DeletePackageButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (
      !confirm(
        `Delete "${packageTitle}"? This cannot be undone.`
      )
    ) {
      return
    }

    setLoading(true)
    try {
      await deletePackage(packageId)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      className="flex-1"
      disabled={loading}
      onClick={handleDelete}
    >
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
