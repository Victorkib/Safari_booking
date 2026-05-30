'use client'

import { adminUpdatePaymentStatus } from '@/app/actions/payments'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AdminPaymentActionsProps {
  paymentId: string
  paymentMethod?: string | null
  mpesaLive?: boolean
}

export function AdminPaymentActions({
  paymentId,
  paymentMethod,
  mpesaLive,
}: AdminPaymentActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  const isLiveMpesa = mpesaLive && paymentMethod === 'mpesa'

  const handleAction = async (status: 'completed' | 'failed') => {
    setLoading(status === 'completed' ? 'approve' : 'reject')
    try {
      await adminUpdatePaymentStatus(paymentId, status)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {isLiveMpesa && (
        <span className="text-[10px] text-muted-foreground">STK pending — auto or manual</span>
      )}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          disabled={loading !== null}
          onClick={() => handleAction('completed')}
        >
          {loading === 'approve' ? 'Approving...' : 'Approve'}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          disabled={loading !== null}
          onClick={() => handleAction('failed')}
        >
          {loading === 'reject' ? 'Rejecting...' : 'Reject'}
        </Button>
      </div>
    </div>
  )
}
