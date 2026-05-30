import { getAllPackages } from '@/app/actions/packages'
import { PackageCard } from '@/components/package-card'
import { Hero } from '@/components/hero'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

export default async function Home() {
  const packages = await getAllPackages()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <Hero />
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Explore Our Safari Packages
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover unforgettable African wildlife experiences
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
            {packages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No packages available yet. Check back soon!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
