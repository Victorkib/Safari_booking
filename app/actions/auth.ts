'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { assertUserIsActive } from '@/lib/users/active-user'

export type UserRole = 'customer' | 'admin' | 'driver'

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  try {
    const row = await assertUserIsActive(session.user.id)
    return {
      ...session,
      user: {
        ...session.user,
        role: row.role,
        name: row.name,
        email: row.email,
      },
    }
  } catch {
    return null
  }
}

export async function getUserId() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session.user.id
}

export async function getUserRole(): Promise<UserRole> {
  const session = await getSession()
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
    throw new Error('You do not have permission to perform this action')
  }
  return role
}

export async function requireAdmin() {
  return requireRole(['admin'])
}

export async function requireDriver() {
  return requireRole(['driver'])
}

export async function requireCustomer() {
  return requireRole(['customer'])
}

export async function requireCustomerOrAdmin() {
  return requireRole(['customer', 'admin'])
}
