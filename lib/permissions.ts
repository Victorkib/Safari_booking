import type { UserRole } from '@/app/actions/auth'

/** Roles allowed to create a booking for themselves (customer flow). */
export const ROLES_CAN_SELF_BOOK: UserRole[] = ['customer']

/** Roles that may use customer portal and /booking/* routes. */
export const ROLES_CUSTOMER_PORTAL: UserRole[] = ['customer']

/** Roles that may access admin console. */
export const ROLES_ADMIN: UserRole[] = ['admin']

/** Roles that may access driver portal. */
export const ROLES_DRIVER: UserRole[] = ['driver']

export function canSelfBook(role: string | null | undefined): boolean {
  return role === 'customer'
}

export function isAdmin(role: string | null | undefined): boolean {
  return role === 'admin'
}

export function isDriver(role: string | null | undefined): boolean {
  return role === 'driver'
}
