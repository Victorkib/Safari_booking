'use server'

import { db } from '@/lib/db'
import { account, drivers, session, user } from '@/lib/db/schema'
import { eq, and, isNull, desc, sql, notInArray } from 'drizzle-orm'
import { requireAdmin, getUserId } from './auth'
import { nanoid } from 'nanoid'
import { hashPassword } from 'better-auth/crypto'
import { revalidatePath } from 'next/cache'
import { createUserSchema, formatZodError, updateUserSchema } from '@/lib/validations'
import type { UserRole } from './auth'

export type AdminUserRow = {
  id: string
  name: string
  email: string
  role: string
  deletedAt: Date | null
  createdAt: Date
}

export async function getAllUsers(role?: UserRole): Promise<AdminUserRow[]> {
  await requireAdmin()

  const conditions = [isNull(user.deletedAt)]
  if (role) {
    conditions.push(eq(user.role, role))
  }

  return await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      deletedAt: user.deletedAt,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(and(...conditions))
    .orderBy(desc(user.createdAt))
}

export async function getCustomerUsers() {
  return getAllUsers('customer')
}

export async function getUserByIdForAdmin(id: string) {
  await requireAdmin()
  const rows = await db.select().from(user).where(eq(user.id, id))
  return rows[0] ?? null
}

export async function getEligibleDriverUsers() {
  await requireAdmin()

  const existingDriverUserIds = await db.select({ userId: drivers.userId }).from(drivers)
  const takenIds = existingDriverUserIds.map((d) => d.userId)

  if (takenIds.length === 0) {
    return await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(and(eq(user.role, 'driver'), isNull(user.deletedAt)))
  }

  return await db
    .select({ id: user.id, name: user.name, email: user.email })
    .from(user)
    .where(
      and(
        eq(user.role, 'driver'),
        isNull(user.deletedAt),
        notInArray(user.id, takenIds)
      )
    )
}

async function countActiveAdmins() {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(user)
    .where(and(eq(user.role, 'admin'), isNull(user.deletedAt)))
  return rows[0]?.count ?? 0
}

export async function createUserAsAdmin(data: {
  name: string
  email: string
  password: string
  role: UserRole
}) {
  await requireAdmin()

  const parsed = createUserSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  const input = parsed.data
  const existing = await db.select().from(user).where(eq(user.email, input.email))
  if (existing[0] && !existing[0].deletedAt) {
    throw new Error('A user with this email already exists')
  }

  const hashed = await hashPassword(input.password)
  const now = new Date()
  const userId = nanoid()

  await db.insert(user).values({
    id: userId,
    name: input.name,
    email: input.email,
    emailVerified: true,
    role: input.role,
    createdAt: now,
    updatedAt: now,
  })

  await db.insert(account).values({
    id: nanoid(),
    accountId: input.email,
    providerId: 'credential',
    userId,
    password: hashed,
    createdAt: now,
    updatedAt: now,
  })

  revalidatePath('/admin/users')
  return { id: userId }
}

export async function updateUserAsAdmin(data: {
  id: string
  name?: string
  email?: string
  role?: UserRole
}) {
  await requireAdmin()
  const currentAdminId = await getUserId()

  const parsed = updateUserSchema.safeParse(data)
  if (!parsed.success) {
    throw new Error(formatZodError(parsed.error))
  }

  const target = await db.select().from(user).where(eq(user.id, parsed.data.id))
  if (!target[0] || target[0].deletedAt) {
    throw new Error('User not found')
  }

  if (parsed.data.role && parsed.data.role !== 'admin' && target[0].role === 'admin') {
    const adminCount = await countActiveAdmins()
    if (adminCount <= 1) {
      throw new Error('Cannot change role of the last administrator')
    }
  }

  if (parsed.data.id === currentAdminId && parsed.data.role && parsed.data.role !== 'admin') {
    throw new Error('You cannot remove your own admin access')
  }

  if (parsed.data.email && parsed.data.email !== target[0].email) {
    const clash = await db.select().from(user).where(eq(user.email, parsed.data.email))
    if (clash[0] && clash[0].id !== parsed.data.id && !clash[0].deletedAt) {
      throw new Error('Email already in use')
    }
  }

  const [updated] = await db
    .update(user)
    .set({
      name: parsed.data.name ?? target[0].name,
      email: parsed.data.email ?? target[0].email,
      role: parsed.data.role ?? target[0].role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, parsed.data.id))
    .returning()

  revalidatePath('/admin/users')
  revalidatePath(`/admin/users/${parsed.data.id}/edit`)
  return updated
}

export async function softDeleteUser(id: string) {
  await requireAdmin()
  const currentAdminId = await getUserId()

  if (id === currentAdminId) {
    throw new Error('You cannot deactivate your own account')
  }

  const target = await db.select().from(user).where(eq(user.id, id))
  if (!target[0] || target[0].deletedAt) {
    throw new Error('User not found')
  }

  if (target[0].role === 'admin') {
    const adminCount = await countActiveAdmins()
    if (adminCount <= 1) {
      throw new Error('Cannot deactivate the last administrator')
    }
  }

  const now = new Date()
  await db
    .update(user)
    .set({ deletedAt: now, updatedAt: now })
    .where(eq(user.id, id))

  await db.delete(session).where(eq(session.userId, id))

  revalidatePath('/admin/users')
  return { id }
}

export async function createDriverWithUser(data: {
  name: string
  email: string
  password: string
  license_number: string
  license_expiry: string
  experience_years?: number
  vehicle_id?: string
  status?: string
}) {
  await requireAdmin()

  const { id: userId } = await createUserAsAdmin({
    name: data.name,
    email: data.email,
    password: data.password,
    role: 'driver',
  })

  const driver = await db
    .insert(drivers)
    .values({
      id: nanoid(),
      userId,
      license_number: data.license_number,
      license_expiry: data.license_expiry,
      experience_years: data.experience_years,
      vehicle_id: data.vehicle_id || null,
      status: data.status ?? 'available',
    })
    .returning()

  revalidatePath('/admin/drivers')
  return driver[0]
}
