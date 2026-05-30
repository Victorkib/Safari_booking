import { getMpesaBaseUrl, type MpesaConfig } from './config'

type OAuthResponse = {
  access_token: string
  expires_in: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

export async function getMpesaAccessToken(config: MpesaConfig): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64')
  const baseUrl = getMpesaBaseUrl(config.env)

  const response = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      method: 'GET',
      headers: {
        Authorization: `Basic ${credentials}`,
      },
      cache: 'no-store',
    }
  )

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`M-Pesa auth failed (${response.status}): ${body}`)
  }

  const data = (await response.json()) as OAuthResponse
  const expiresIn = parseInt(data.expires_in, 10) || 3600

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  }

  return data.access_token
}
