'use server'

import { db } from '@/lib/db'
import { destinations } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAdmin } from './auth'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function getAllDestinations() {
  return await db
    .select()
    .from(destinations)
    .orderBy(desc(destinations.created_at))
}

export async function getDestinationById(id: string) {
  const result = await db
    .select()
    .from(destinations)
    .where(eq(destinations.id, id))
  return result[0] || null
}

export async function createDestination(data: {
  name: string
  country: string
  region?: string
  description?: string
  highlights?: string[]
  best_season?: string
  wildlife?: string[]
  image_url?: string
}) {
  await requireAdmin()

  const dest = await db
    .insert(destinations)
    .values({ id: nanoid(), ...data })
    .returning()

  revalidatePath('/destinations')
  return dest[0]
}
