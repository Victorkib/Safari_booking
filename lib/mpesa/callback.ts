import { applyPaymentStatusChange, findPaymentByCheckoutRequestId } from '@/lib/payments/transitions'

type CallbackMetadataItem = {
  Name: string
  Value: string | number
}

type StkCallbackBody = {
  Body?: {
    stkCallback?: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item?: CallbackMetadataItem[]
      }
    }
  }
}

function getMetadataValue(items: CallbackMetadataItem[] | undefined, name: string): string | null {
  const item = items?.find((i) => i.Name === name)
  if (item === undefined || item.Value === null) return null
  return String(item.Value)
}

export type StkCallbackResult =
  | { ok: true; checkoutRequestId: string; receiptNumber: string | null }
  | { ok: false; checkoutRequestId: string; resultDesc: string }

export function parseStkCallback(payload: unknown): StkCallbackResult | null {
  const body = payload as StkCallbackBody
  const callback = body.Body?.stkCallback

  if (!callback?.CheckoutRequestID) {
    return null
  }

  if (callback.ResultCode === 0) {
    return {
      ok: true,
      checkoutRequestId: callback.CheckoutRequestID,
      receiptNumber: getMetadataValue(callback.CallbackMetadata?.Item, 'MpesaReceiptNumber'),
    }
  }

  return {
    ok: false,
    checkoutRequestId: callback.CheckoutRequestID,
    resultDesc: callback.ResultDesc ?? 'Payment failed',
  }
}

export async function processStkCallback(payload: unknown): Promise<{
  processed: boolean
  message: string
}> {
  const parsed = parseStkCallback(payload)

  if (!parsed) {
    return { processed: false, message: 'Invalid callback payload' }
  }

  const payment = await findPaymentByCheckoutRequestId(parsed.checkoutRequestId)

  if (!payment) {
    console.warn('[mpesa] No payment for checkout:', parsed.checkoutRequestId)
    return { processed: false, message: 'Payment not found' }
  }

  if (parsed.ok) {
    if (payment.status === 'completed') {
      return { processed: true, message: 'Already completed' }
    }

    await applyPaymentStatusChange(payment.id, 'completed', {
      mpesaReceipt: parsed.receiptNumber ?? undefined,
    })

    return { processed: true, message: 'Payment completed' }
  }

  if (payment.status === 'failed') {
    return { processed: true, message: 'Already failed' }
  }

  await applyPaymentStatusChange(payment.id, 'failed')
  return { processed: true, message: parsed.resultDesc }
}
