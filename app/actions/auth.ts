'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export type UserRole = 'customer' | 'admin' | 'driver'

export async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user.id
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session
}

export async function getUserRole(): Promise<UserRole> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  const role = (session.user as { role?: string }).role
  if (role === 'admin' || role === 'driver') return role
  return 'customer'
}

export async function requireRole(allowed: UserRole[]) {
  const role = await getUserRole()
  if (!allowed.includes(role)) {
    throw new Error('Unauthorized')
  }
  return role
}

export async function requireAdmin() {
  return requireRole(['admin'])
}

export async function requireDriver() {
  return requireRole(['driver'])
}
