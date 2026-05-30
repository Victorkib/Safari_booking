'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMpesaPaymentStatus } from '@/app/actions/mpesa'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface MpesaPaymentPollerProps {
  bookingId: string
  mpesaPhone?: string | null
}

export function MpesaPaymentPoller({ bookingId, mpesaPhone }: MpesaPaymentPollerProps) {
  const router = useRouter()
  const [message, setMessage] = useState('Waiting for M-Pesa confirmation…')
  const attemptsRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    let interval: ReturnType<typeof setInterval> | null = null

    const poll = async () => {
      try {
        const result = await getMpesaPaymentStatus(bookingId)
        if (cancelled) return

        if (result.status === 'completed') {
          setMessage('Payment confirmed!')
          router.refresh()
          if (interval) clearInterval(interval)
          return
        }

        if (result.status === 'failed') {
          setMessage(result.message ?? 'Payment failed or was cancelled.')
          router.refresh()
          if (interval) clearInterval(interval)
          return
        }

        attemptsRef.current += 1
        if (attemptsRef.current >= 40) {
          setMessage(
            'Still waiting for confirmation. Check your phone or retry from My Bookings.'
          )
          if (interval) clearInterval(interval)
        }
      } catch {
        if (!cancelled) {
          setMessage('Checking payment status…')
        }
      }
    }

    poll()
    interval = setInterval(poll, 3000)

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
    }
  }, [bookingId, router])

  return (
    <Card className="mb-8 border-green-200 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-green-900">
          <Loader2 className="size-5 animate-spin" />
          M-Pesa STK Push sent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-green-900">
        {mpesaPhone && (
          <p>
            A payment prompt was sent to <strong>+{mpesaPhone}</strong>. Enter your M-Pesa PIN on
            your phone.
          </p>
        )}
        <p>{message}</p>
        <p className="text-xs text-green-800/80">
          This page updates automatically once Safaricom confirms payment.
        </p>
      </CardContent>
    </Card>
  )
}
