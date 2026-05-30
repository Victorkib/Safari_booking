import { getAllPackages } from '@/app/actions/packages'
import { PackageCard } from '@/components/package-card'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/safari/how-it-works'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const packages = await getAllPackages()
  const featured = packages.slice(0, 6)

  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <HowItWorks />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-secondary">
                Curated collections
              </p>
              <h2 className="font-display mt-2 text-4xl font-semibold tracking-tight text-foreground">
                Signature safari packages
              </h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                Handpicked itineraries across Kenya&apos;s most iconic wildlife destinations.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/packages">View all packages</Link>
            </Button>
          </div>

          {featured.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 py-16 text-center">
              <p className="text-muted-foreground">
                No packages available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
