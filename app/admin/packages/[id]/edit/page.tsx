import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPackageById } from '@/app/actions/packages'
import { PackageForm } from '@/components/package-form'
import { Button } from '@/components/ui/button'

interface EditPackagePageProps {
  params: Promise<{ id: string }>
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = await params
  const pkg = await getPackageById(id)

  if (!pkg) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Edit Package</h1>
            <p className="text-muted-foreground">{pkg.title}</p>
          </div>
          <Link href="/admin/packages">
            <Button variant="outline">Back to Packages</Button>
          </Link>
        </div>
        <PackageForm
          initialData={{
            id: pkg.id,
            title: pkg.title,
            description: pkg.description ?? undefined,
            duration_days: pkg.duration_days,
            price: pkg.price,
            difficulty_level: pkg.difficulty_level ?? undefined,
            group_size_min: pkg.group_size_min ?? undefined,
            group_size_max: pkg.group_size_max ?? undefined,
            destinations: pkg.destinations ?? undefined,
            highlights: pkg.highlights ?? undefined,
            included_services: pkg.included_services ?? undefined,
            excluded_items: pkg.excluded_items ?? undefined,
            status: pkg.status ?? 'active',
          }}
        />
      </div>
    </div>
  )
}
