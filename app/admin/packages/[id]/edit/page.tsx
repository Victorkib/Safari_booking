import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPackageById } from '@/app/actions/packages'
import { PackageForm } from '@/components/package-form'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'

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
    <>
      <PageHeader
        title="Edit Package"
        description={pkg.title}
        actions={(
          <Link href="/admin/packages">
            <Button variant="outline">Back to Packages</Button>
          </Link>
        )}
      />
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
    </>
  )
}
