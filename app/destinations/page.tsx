import Image from 'next/image'
import { getAllDestinations } from '@/app/actions/destinations'
import { PageHeader } from '@/components/layout/page-header'
import { getDestinationImageUrl } from '@/lib/safari-images'

export default async function DestinationsPage() {
  const destinations = await getAllDestinations()

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Safari destinations"
          description="Explore Kenya's premier wildlife parks and conservancies"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => (
            <article
              key={dest.id}
              className="group overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={getDestinationImageUrl(dest.id, dest.name)}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/70">
                    {dest.region}, {dest.country}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-white">{dest.name}</h3>
                </div>
              </div>
              <div className="space-y-4 p-5">
                {dest.description && (
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {dest.description}
                  </p>
                )}
                {dest.best_season && (
                  <p className="text-xs text-muted-foreground">
                    <strong>Best season:</strong> {dest.best_season}
                  </p>
                )}
                {dest.wildlife && dest.wildlife.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {dest.wildlife.slice(0, 4).map((animal) => (
                      <span
                        key={animal}
                        className="rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {animal}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {destinations.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No destinations yet. Run <code className="text-sm">npm run db:seed</code> to populate sample data.
          </p>
        )}
      </div>
    </main>
  )
}
