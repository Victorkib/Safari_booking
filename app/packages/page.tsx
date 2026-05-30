import { getAllPackages } from '@/app/actions/packages'
import { PackageCard } from '@/components/package-card'
import { PageHeader } from '@/components/layout/page-header'

export default async function PackagesPage() {
  const packages = await getAllPackages()

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="All safari packages"
          description="Curated journeys across Kenya's most iconic landscapes"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>

        {packages.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">
            No packages available yet. Run <code className="text-sm">npm run db:seed</code> to get started.
          </p>
        )}
      </div>
    </main>
  )
}
