import Link from 'next/link'
import { PackageForm } from '@/components/package-form'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'

export default function NewPackagePage() {
  return (
    <>
      <PageHeader
        title="Create New Package"
        description="Add a new safari package to the catalog"
        actions={(
          <Link href="/admin/packages">
            <Button variant="outline">Back to Packages</Button>
          </Link>
        )}
      />
      <PackageForm />
    </>
  )
}
