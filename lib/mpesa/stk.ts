import { getMpesaAccessToken } from './auth'
import { getMpesaBaseUrl, type MpesaConfig } from './config'
import { buildDarajaPassword, getDarajaTimestamp } from './utils'

export type StkPushResult = {
  merchantRequestId: string
  checkoutRequestId: string
  responseCode: string
  responseDescription: string
  customerMessage: string
}

type StkPushResponse = {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

export async function initiateStkPush(
  config: MpesaConfig,
  input: {
    phone: string
    amount: number
    accountReference: string
    transactionDesc: string
  }
): Promise<StkPushResult> {
  if (input.amount < 1) {
    throw new Error('M-Pesa amount must be at least KES 1')
  }

  const timestamp = getDarajaTimestamp()
  const password = buildDarajaPassword(config.shortcode, config.passkey, timestamp)
  const token = await getMpesaAccessToken(config)
  const baseUrl = getMpesaBaseUrl(config.env)

  const payload = {
    BusinessShortCode: config.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: input.amount,
    PartyA: input.phone,
    PartyB: config.shortcode,
    PhoneNumber: input.phone,
    CallBackURL: config.callbackUrl,
    AccountReference: input.accountReference.slice(0, 12),
    TransactionDesc: input.transactionDesc.slice(0, 13),
  }

  const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  })

  const data = (await response.json()) as StkPushResponse & { errorMessage?: string }

  if (!response.ok || data.ResponseCode !== '0') {
    throw new Error(
      data.errorMessage ??
        data.ResponseDescription ??
        `M-Pesa STK Push failed (${response.status})`
    )
  }

  return {
    merchantRequestId: data.MerchantRequestID,
    checkoutRequestId: data.CheckoutRequestID,
    responseCode: data.ResponseCode,
    responseDescription: data.ResponseDescription,
    customerMessage: data.CustomerMessage,
  }
}

export type StkQueryResult = {
  resultCode: string
  resultDesc: string
}

type StkQueryResponse = {
  ResponseCode: string
  ResultCode?: string
  ResultDesc?: string
  errorMessage?: string
}

export async function queryStkPushStatus(
  config: MpesaConfig,
  checkoutRequestId: string
): Promise<StkQueryResult> {
  const timestamp = getDarajaTimestamp()
  const password = buildDarajaPassword(config.shortcode, config.passkey, timestamp)
  const token = await getMpesaAccessToken(config)
  const baseUrl = getMpesaBaseUrl(config.env)

  const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    cache: 'no-store',
  })

  const data = (await response.json()) as StkQueryResponse

  if (!response.ok || data.ResponseCode !== '0') {
    throw new Error(data.errorMessage ?? data.ResultDesc ?? 'STK query failed')
  }

  return {
    resultCode: data.ResultCode ?? '1',
    resultDesc: data.ResultDesc ?? 'Unknown',
  }
}
