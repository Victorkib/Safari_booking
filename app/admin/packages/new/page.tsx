import Link from 'next/link'
import { PackageForm } from '@/components/package-form'
import { Button } from '@/components/ui/button'

export default function NewPackagePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Create New Package</h1>
            <p className="text-muted-foreground">Add a new safari package to the catalog</p>
          </div>
          <Link href="/admin/packages">
            <Button variant="outline">Back to Packages</Button>
          </Link>
        </div>
        <PackageForm />
      </div>
    </div>
  )
}
