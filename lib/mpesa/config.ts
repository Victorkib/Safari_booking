export type MpesaEnvironment = 'sandbox' | 'production'

export type MpesaConfig = {
  consumerKey: string
  consumerSecret: string
  passkey: string
  shortcode: string
  env: MpesaEnvironment
  callbackUrl: string
  accountReference: string
}

export function getMpesaConfig(): MpesaConfig | null {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const passkey = process.env.MPESA_PASSKEY

  if (!consumerKey || !consumerSecret || !passkey) {
    return null
  }

  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  const env = (process.env.MPESA_ENV === 'production' ? 'production' : 'sandbox') as MpesaEnvironment

  return {
    consumerKey,
    consumerSecret,
    passkey,
    shortcode: process.env.MPESA_SHORTCODE ?? '174379',
    env,
    callbackUrl: process.env.MPESA_CALLBACK_URL ?? `${baseUrl}/api/mpesa/callback`,
    accountReference: process.env.MPESA_ACCOUNT_REFERENCE ?? 'SafariAdventures',
  }
}

export function isMpesaConfigured(): boolean {
  return getMpesaConfig() !== null
}

export function getMpesaBaseUrl(env: MpesaEnvironment): string {
  return env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}
