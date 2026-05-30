import { getAdminPackages } from '@/app/actions/packages'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeletePackageButton } from '@/components/delete-package-button'
import Link from 'next/link'

export default async function AdminPackages() {
  const packages = await getAdminPackages()

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Packages Management</h1>
            <p className="text-muted-foreground">
              Create and manage safari packages
            </p>
          </div>
          <Link href="/admin/packages/new">
            <Button>Create New Package</Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Packages</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{packages.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                KES {(packages.length > 0 ? 
                  packages.reduce((sum, p) => sum + parseFloat(p.price), 0) / packages.length 
                  : 0).toFixed(0)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {Array.from(new Set(packages.flatMap(p => p.destinations || []))).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{pkg.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {pkg.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Duration</p>
                    <p className="font-semibold">{pkg.duration_days}d</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Price</p>
                    <p className="font-semibold">KES {pkg.price}</p>
                  </div>
                </div>

                {pkg.destinations && pkg.destinations.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Destinations</p>
                    <div className="flex flex-wrap gap-1">
                      {pkg.destinations.slice(0, 2).map((dest) => (
                        <span key={dest} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          {dest}
                        </span>
                      ))}
                      {pkg.destinations.length > 2 && (
                        <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                          +{pkg.destinations.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {pkg.difficulty_level && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
                    <p className="text-sm font-semibold capitalize">{pkg.difficulty_level}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Link href={`/admin/packages/${pkg.id}/edit`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      Edit
                    </Button>
                  </Link>
                  <DeletePackageButton packageId={pkg.id} packageTitle={pkg.title} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <Card>
            <CardContent className="pt-8 text-center">
              <p className="text-muted-foreground mb-4">
                No packages yet. Create your first safari package!
              </p>
              <Link href="/admin/packages/new">
                <Button>Create Package</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
