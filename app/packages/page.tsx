import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getAllPackages } from '@/app/actions/packages'
import { PackageCard } from '@/components/package-card'

export default async function PackagesPage() {
  const packages = await getAllPackages()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">All Safari Packages</h1>
            <p className="text-lg text-muted-foreground">
              Choose your perfect African adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>

          {packages.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No packages available yet. Run <code className="text-sm">npm run db:seed</code> to get started.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
