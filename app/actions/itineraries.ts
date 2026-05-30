'use server'

import { db } from '@/lib/db'
import { itineraries } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { requireAdmin } from './auth'
import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

export async function getItinerariesByPackageId(packageId: string) {
  return await db
    .select()
    .from(itineraries)
    .where(eq(itineraries.package_id, packageId))
    .orderBy(asc(itineraries.day_number))
}

export async function createItineraryDay(data: {
  package_id: string
  day_number: number
  title: string
  description?: string
  activities?: string[]
  meals?: string[]
  accommodation?: string
  distance_km?: string
}) {
  await requireAdmin()

  const day = await db
    .insert(itineraries)
    .values({ id: nanoid(), ...data })
    .returning()

  revalidatePath(`/packages/${data.package_id}`)
  return day[0]
}
