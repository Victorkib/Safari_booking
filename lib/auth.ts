import { betterAuth } from 'better-auth'
import { headers } from 'next/headers'
import { pool } from '@/lib/db'
import { getSiteUrl } from '@/lib/seo/site'

function buildTrustedOrigins(): string[] {
  const origins = new Set<string>()
  const site = getSiteUrl()
  origins.add(site)
  if (process.env.BETTER_AUTH_URL?.trim()) {
    origins.add(process.env.BETTER_AUTH_URL.trim().replace(/\/$/, ''))
  }
  return [...origins]
}

export const auth = betterAuth({
  database: pool,
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'customer',
        required: false,
        input: false,
      },
    },
  },
  baseURL: process.env.BETTER_AUTH_URL?.trim() || getSiteUrl(),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: buildTrustedOrigins(),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
})

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export type SessionUser = {
  id: string
  name: string
  email: string
  role?: string
}
