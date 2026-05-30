'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createPayment } from '@/app/actions/payments'
import { formatPhoneForDisplay } from '@/lib/mpesa/phone'
import { CreditCard, Smartphone, Building2, ShieldCheck } from 'lucide-react'

interface PaymentFormProps {
  bookingId: string
  amount: string
  mpesaLive: boolean
}

export function PaymentForm({ bookingId, amount, mpesaLive }: PaymentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'stripe' | 'bank_transfer'>('mpesa')
  const [formData, setFormData] = useState({
    mpesa_phone: '',
    card_number: '',
    card_expiry: '',
    card_cvc: '',
    account_number: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (paymentMethod === 'mpesa' && !formData.mpesa_phone) {
        setError('Please enter M-Pesa phone number')
        return
      }
      if (paymentMethod === 'stripe' && (!formData.card_number || !formData.card_expiry || !formData.card_cvc)) {
        setError('Please enter complete card details')
        return
      }
      if (paymentMethod === 'bank_transfer' && !formData.account_number) {
        setError('Please enter account number')
        return
      }

      const result = await createPayment({
        booking_id: bookingId,
        payment_method: paymentMethod,
        mpesa_phone: paymentMethod === 'mpesa' ? formData.mpesa_phone : undefined,
      })

      const params = new URLSearchParams()
      if (result.mpesaStk) {
        params.set('stk', '1')
      }

      router.push(`/booking/${bookingId}/success${params.toString() ? `?${params}` : ''}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const methods = [
    {
      id: 'mpesa' as const,
      icon: Smartphone,
      title: 'M-Pesa',
      description: mpesaLive
        ? 'STK Push — pay on your phone'
        : 'Mobile money (manual verification)',
    },
    {
      id: 'stripe' as const,
      icon: CreditCard,
      title: 'Credit card',
      description: 'Visa or Mastercard (simulated)',
    },
    {
      id: 'bank_transfer' as const,
      icon: Building2,
      title: 'Bank transfer',
      description: 'Direct deposit (manual verification)',
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert className={mpesaLive ? 'border-green-200 bg-green-50 text-green-900' : 'border-amber-200 bg-amber-50 text-amber-900'}>
        <ShieldCheck className="size-4" />
        <AlertDescription>
          {mpesaLive
            ? 'M-Pesa payments are processed live via Safaricom STK Push. Enter your PIN when prompted — successful payments confirm your booking automatically.'
            : 'M-Pesa is in manual verification mode. Payments are reviewed by our team before confirmation.'}
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Label className="text-sm font-semibold">Payment method</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={(v) => setPaymentMethod(v as typeof paymentMethod)}
          className="space-y-3"
        >
          {methods.map((method) => (
            <label
              key={method.id}
              htmlFor={method.id}
              className={`flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition ${
                paymentMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-muted-foreground/50'
              }`}
            >
              <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
              <method.icon className="mt-0.5 size-5 text-secondary" />
              <div>
                <p className="font-semibold">{method.title}</p>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      {paymentMethod === 'mpesa' && (
        <div className="space-y-2">
          <Label htmlFor="mpesa_phone">M-Pesa phone number</Label>
          <Input
            id="mpesa_phone"
            type="tel"
            name="mpesa_phone"
            value={formData.mpesa_phone}
            onChange={handleInputChange}
            placeholder="07XX XXX XXX or 2547XXXXXXXX"
            required
          />
          {formData.mpesa_phone && (
            <p className="text-xs text-muted-foreground">
              STK prompt will be sent to this number
              {(() => {
                try {
                  const digits = formData.mpesa_phone.replace(/\D/g, '')
                  const normalized =
                    digits.startsWith('254') && digits.length === 12
                      ? digits
                      : digits.startsWith('0') && digits.length === 10
                        ? `254${digits.slice(1)}`
                        : null
                  return normalized ? ` (${formatPhoneForDisplay(normalized)})` : ''
                } catch {
                  return ''
                }
              })()}
            </p>
          )}
        </div>
      )}

      {paymentMethod === 'stripe' && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Card details are for demo only — not processed by a payment provider.
          </p>
          <div className="space-y-2">
            <Label htmlFor="card_number">Card number</Label>
            <Input
              id="card_number"
              name="card_number"
              value={formData.card_number}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="card_expiry">Expiry</Label>
              <Input
                id="card_expiry"
                name="card_expiry"
                value={formData.card_expiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="card_cvc">CVC</Label>
              <Input
                id="card_cvc"
                name="card_cvc"
                value={formData.card_cvc}
                onChange={handleInputChange}
                placeholder="123"
                required
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'bank_transfer' && (
        <div className="space-y-2">
          <Label htmlFor="account_number">Account number</Label>
          <Input
            id="account_number"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            placeholder="Enter your bank account number"
            required
          />
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading
          ? paymentMethod === 'mpesa' && mpesaLive
            ? 'Sending STK Push…'
            : 'Submitting payment…'
          : paymentMethod === 'mpesa' && mpesaLive
            ? `Pay with M-Pesa — KES ${parseFloat(amount).toLocaleString()}`
            : `Submit payment — KES ${parseFloat(amount).toLocaleString()}`}
      </Button>
    </form>
  )
}
