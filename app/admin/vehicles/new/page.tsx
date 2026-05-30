import Link from 'next/link'
import { VehicleForm } from '@/components/vehicle-form'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'

export default function NewVehiclePage() {
  return (
    <>
      <PageHeader
        title="Add Vehicle"
        description="Register a new vehicle in the safari fleet"
        actions={(
          <Link href="/admin/vehicles">
            <Button variant="outline">Back to Vehicles</Button>
          </Link>
        )}
      />
      <VehicleForm />
    </>
  )
}
