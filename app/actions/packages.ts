'use server'

import { db } from '@/lib/db'
import { safariPackages } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from './auth'
import { nanoid } from 'nanoid'

export type PackageInput = {
  title: string
  description?: string
  duration_days: number
  price: string
  difficulty_level?: string
  group_size_min?: number
  group_size_max?: number
  destinations?: string[]
  highlights?: string[]
  included_services?: string[]
  excluded_items?: string[]
  images?: string[]
  status?: string
}

export async function getAllPackages() {
  return await db
    .select()
    .from(safariPackages)
    .where(eq(safariPackages.status, 'active'))
    .orderBy(desc(safariPackages.created_at))
}

export async function getAdminPackages() {
  await requireAdmin()
  return await db
    .select()
    .from(safariPackages)
    .orderBy(desc(safariPackages.created_at))
}

export async function getPackageById(id: string) {
  const result = await db
    .select()
    .from(safariPackages)
    .where(eq(safariPackages.id, id))
  return result[0] || null
}

export async function createPackage(data: PackageInput) {
  await requireAdmin()

  const pkg = await db
    .insert(safariPackages)
    .values({
      id: nanoid(),
      title: data.title,
      description: data.description,
      duration_days: data.duration_days,
      price: data.price,
      difficulty_level: data.difficulty_level,
      group_size_min: data.group_size_min,
      group_size_max: data.group_size_max,
      destinations: data.destinations,
      highlights: data.highlights,
      included_services: data.included_services,
      excluded_items: data.excluded_items,
      images: data.images,
      status: data.status ?? 'active',
    })
    .returning()

  revalidatePath('/')
  revalidatePath('/packages')
  revalidatePath('/admin/packages')
  return pkg[0]
}

export async function updatePackage(id: string, data: Partial<PackageInput>) {
  await requireAdmin()

  const updated = await db
    .update(safariPackages)
    .set({ ...data, updated_at: new Date() })
    .where(eq(safariPackages.id, id))
    .returning()

  revalidatePath('/')
  revalidatePath('/packages')
  revalidatePath('/admin/packages')
  revalidatePath(`/packages/${id}`)
  return updated[0]
}

export async function deletePackage(id: string) {
  await requireAdmin()

  await db.delete(safariPackages).where(eq(safariPackages.id, id))
  revalidatePath('/')
  revalidatePath('/packages')
  revalidatePath('/admin/packages')
}
