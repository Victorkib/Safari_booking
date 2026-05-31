import { getAllPackages } from '@/app/actions/packages'
import { getSession } from '@/app/actions/auth'
import { AdminPreviewBanner } from '@/components/admin/admin-preview-banner'
import { PackageCard } from '@/components/package-card'
import { PageHeader } from '@/components/layout/page-header'

export default async function PackagesPage() {
  const [packages, session] = await Promise.all([getAllPackages(), getSession()])
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin'

  return (
    <main className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {isAdmin && <AdminPreviewBanner />}
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
