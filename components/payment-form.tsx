'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createPayment, updatePaymentStatus } from '@/app/actions/payments'
import { useRouter } from 'next/navigation'

interface PaymentFormProps {
  bookingId: string
  amount: string
}

export function PaymentForm({ bookingId, amount }: PaymentFormProps) {
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
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let transactionId = ''
      let mpesaReceipt = ''

      if (paymentMethod === 'mpesa') {
        if (!formData.mpesa_phone) {
          setError('Please enter M-Pesa phone number')
          setLoading(false)
          return
        }
        transactionId = `MPESA-${Date.now()}`
        mpesaReceipt = formData.mpesa_phone
      } else if (paymentMethod === 'stripe') {
        if (!formData.card_number || !formData.card_expiry || !formData.card_cvc) {
          setError('Please enter complete card details')
          setLoading(false)
          return
        }
        transactionId = `CARD-${Date.now()}`
      } else {
        if (!formData.account_number) {
          setError('Please enter account number')
          setLoading(false)
          return
        }
        transactionId = `BANK-${Date.now()}`
      }

      const payment = await createPayment({
        booking_id: bookingId,
        amount: amount,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        mpesa_receipt: mpesaReceipt,
      })

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update payment status to completed
      await updatePaymentStatus(payment.id, 'completed')

      router.push(`/booking/${bookingId}/success`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold mb-4">Select Payment Method</label>

        <div
          onClick={() => setPaymentMethod('mpesa')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
            paymentMethod === 'mpesa'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="mpesa"
              checked={paymentMethod === 'mpesa'}
              onChange={(e) => setPaymentMethod(e.target.value as 'mpesa')}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold">M-Pesa</p>
              <p className="text-sm text-muted-foreground">Mobile money transfer</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setPaymentMethod('stripe')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
            paymentMethod === 'stripe'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold">Credit Card</p>
              <p className="text-sm text-muted-foreground">Visa or Mastercard</p>
            </div>
          </div>
        </div>

        <div
          onClick={() => setPaymentMethod('bank_transfer')}
          className={`p-4 border-2 rounded-lg cursor-pointer transition ${
            paymentMethod === 'bank_transfer'
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-muted-foreground'
          }`}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="payment"
              value="bank_transfer"
              checked={paymentMethod === 'bank_transfer'}
              onChange={(e) => setPaymentMethod(e.target.value as 'bank_transfer')}
              className="w-4 h-4"
            />
            <div>
              <p className="font-semibold">Bank Transfer</p>
              <p className="text-sm text-muted-foreground">Direct bank deposit</p>
            </div>
          </div>
        </div>
      </div>

      {/* M-Pesa Form */}
      {paymentMethod === 'mpesa' && (
        <div>
          <label className="block text-sm font-semibold mb-2">M-Pesa Phone Number</label>
          <input
            type="tel"
            name="mpesa_phone"
            value={formData.mpesa_phone}
            onChange={handleInputChange}
            placeholder="254xxxxxxxxx or +254xxxxxxxxx"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            You&apos;ll receive a prompt on your phone to complete the payment
          </p>
        </div>
      )}

      {/* Card Form */}
      {paymentMethod === 'stripe' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Card Number</label>
            <input
              type="text"
              name="card_number"
              value={formData.card_number}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Expiry Date</label>
              <input
                type="text"
                name="card_expiry"
                value={formData.card_expiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">CVC</label>
              <input
                type="text"
                name="card_cvc"
                value={formData.card_cvc}
                onChange={handleInputChange}
                placeholder="123"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
        </div>
      )}

      {/* Bank Transfer Form */}
      {paymentMethod === 'bank_transfer' && (
        <div>
          <label className="block text-sm font-semibold mb-2">Account Number</label>
          <input
            type="text"
            name="account_number"
            value={formData.account_number}
            onChange={handleInputChange}
            placeholder="Enter your bank account number"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Our banking details will be provided after verification
          </p>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading ? 'Processing Payment...' : `Pay KES ${amount}`}
      </Button>
    </form>
  )
}
