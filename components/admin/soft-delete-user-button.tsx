'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { softDeleteUser } from '@/app/actions/users'

export function SoftDeleteUserButton({
  userId,
  label = 'Deactivate',
}: {
  userId: string
  label?: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!confirm('Deactivate this user? They will be permanently removed after 7 days.')) {
      return
    }
    setLoading(true)
    try {
      await softDeleteUser(userId)
      router.push('/admin/users')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deactivate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" disabled={loading} onClick={handleClick}>
      {loading ? 'Deactivating…' : label}
    </Button>
  )
}
