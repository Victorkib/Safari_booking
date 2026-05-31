import Image from 'next/image'
import { getPackageImageUrl } from '@/lib/safari-images'
import { Calendar, Users } from 'lucide-react'

interface PackageHeroProps {
  packageId: string
  title: string
  destinations?: string[] | null
  durationDays: number
  difficultyLevel?: string | null
  groupSizeMin?: number | null
  groupSizeMax?: number | null
  price: string
}

export function PackageHero({
  packageId,
  title,
  destinations,
  durationDays,
  difficultyLevel,
  groupSizeMin,
  groupSizeMax,
  price,
}: PackageHeroProps) {
  const imageUrl = getPackageImageUrl(packageId, destinations)

  return (
    <section className="relative mb-10 overflow-hidden rounded-2xl border border-border/80">
      <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          {destinations && destinations.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
              {destinations.slice(0, 3).join(' · ')}
            </p>
          )}
          <h1 className="font-display mt-2 max-w-3xl text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/85">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4 text-secondary" />
              {durationDays} days
            </span>
            {groupSizeMin && groupSizeMax && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="size-4 text-secondary" />
                {groupSizeMin}–{groupSizeMax} guests
              </span>
            )}
            {difficultyLevel && (
              <span className="rounded-full bg-secondary/90 px-3 py-0.5 text-xs font-semibold text-secondary-foreground">
                {difficultyLevel}
              </span>
            )}
            <span className="font-display text-lg font-semibold text-secondary sm:ml-auto">
              From KES {parseFloat(price).toLocaleString()} / person
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
