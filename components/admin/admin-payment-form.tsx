'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { adminRecordPayment } from '@/app/actions/payments'
import { adminUpdatePaymentStatus } from '@/app/actions/payments'

interface AdminPaymentFormProps {
  bookingId: string
  amount: string
  mpesaLive: boolean
  pendingPaymentId?: string | null
}

export function AdminPaymentForm({
  bookingId,
  amount,
  mpesaLive,
  pendingPaymentId,
}: AdminPaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [method, setMethod] = useState<'cash' | 'bank_transfer' | 'mpesa_manual' | 'mpesa_stk'>('cash')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [mpesaReceipt, setMpesaReceipt] = useState('')
  const [notes, setNotes] = useState('')

  const handleRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await adminRecordPayment({
        booking_id: bookingId,
        method,
        mpesa_phone: mpesaPhone || undefined,
        transaction_id: transactionId || undefined,
        mpesa_receipt: mpesaReceipt || undefined,
        notes: notes || undefined,
      })

      if (result.mpesaStk) {
        alert(result.customerMessage ?? 'STK Push sent to customer phone.')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPending = async () => {
    if (!pendingPaymentId) return
    setLoading(true)
    setError('')
    try {
      await adminUpdatePaymentStatus(pendingPaymentId, 'completed')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {pendingPaymentId && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-sm font-medium">Pending payment awaiting verification</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Confirm funds received (M-Pesa manual / bank) then mark complete.
          </p>
          <Button
            type="button"
            className="mt-3"
            size="sm"
            disabled={loading}
            onClick={handleVerifyPending}
          >
            Verify &amp; complete payment
          </Button>
        </div>
      )}

      <form onSubmit={handleRecord} className="space-y-4">
        <div className="space-y-2">
          <Label>Payment method</Label>
          <Select value={method} onValueChange={(v) => setMethod(v as typeof method)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash received</SelectItem>
              <SelectItem value="bank_transfer">Bank transfer received</SelectItem>
              <SelectItem value="mpesa_manual">M-Pesa (manual reference)</SelectItem>
              {mpesaLive && <SelectItem value="mpesa_stk">M-Pesa STK Push to customer</SelectItem>}
            </SelectContent>
          </Select>
        </div>

        {(method === 'mpesa_manual' || method === 'mpesa_stk') && (
          <div className="space-y-2">
            <Label>Customer M-Pesa phone</Label>
            <Input
              type="tel"
              value={mpesaPhone}
              onChange={(e) => setMpesaPhone(e.target.value)}
              placeholder="07XX XXX XXX"
              required
            />
          </div>
        )}

        {(method === 'mpesa_manual' || method === 'bank_transfer') && (
          <div className="space-y-2">
            <Label>Reference / receipt (optional)</Label>
            <Input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Transaction or receipt number"
            />
          </div>
        )}

        {method === 'mpesa_manual' && (
          <div className="space-y-2">
            <Label>M-Pesa receipt (optional)</Label>
            <Input value={mpesaReceipt} onChange={(e) => setMpesaReceipt(e.target.value)} />
          </div>
        )}

        <div className="space-y-2">
          <Label>Internal notes (optional)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
        </div>

        <p className="text-sm text-muted-foreground">
          Amount: <strong>KES {parseFloat(amount).toLocaleString()}</strong>
          {method === 'cash' || method === 'bank_transfer'
            ? ' — marks booking confirmed immediately'
            : method === 'mpesa_stk'
              ? ' — sends STK to customer; auto-confirms on success'
              : ' — marks paid; verify when reference checks out'}
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Processing…' : 'Record payment'}
        </Button>
      </form>
    </div>
  )
}
