import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getPackageImageUrl } from '@/lib/safari-images'
import { Calendar, Users } from 'lucide-react'

interface PackageCardProps {
  package: {
    id: string
    title: string
    description: string | null
    duration_days: number
    price: string
    difficulty_level: string | null
    group_size_min: number | null
    group_size_max: number | null
    destinations: string[] | null
    highlights: string[] | null
  }
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  const imageUrl = getPackageImageUrl(pkg.id, pkg.destinations)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-xl">
      <Link href={`/packages/${pkg.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={pkg.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {pkg.difficulty_level && (
          <span className="absolute right-3 top-3 rounded-full bg-secondary/90 px-3 py-1 text-xs font-semibold text-secondary-foreground backdrop-blur-sm">
            {pkg.difficulty_level}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link href={`/packages/${pkg.id}`}>
          <h3 className="font-display text-xl font-semibold tracking-tight group-hover:text-primary">
            {pkg.title}
          </h3>
        </Link>

        <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5 text-secondary" />
            {pkg.duration_days} days
          </span>
          {pkg.group_size_min && pkg.group_size_max && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5 text-secondary" />
              {pkg.group_size_min}–{pkg.group_size_max} guests
            </span>
          )}
        </div>

        {pkg.description && (
          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {pkg.description}
          </p>
        )}

        {pkg.destinations && pkg.destinations.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {pkg.destinations.slice(0, 3).map((dest) => (
              <span
                key={dest}
                className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {dest}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-border/80 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">From</p>
            <p className="font-display text-2xl font-semibold text-primary">
              KES {parseFloat(pkg.price).toLocaleString()}
            </p>
          </div>
          <Button asChild size="sm">
            <Link href={`/packages/${pkg.id}`}>View &amp; Book</Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
