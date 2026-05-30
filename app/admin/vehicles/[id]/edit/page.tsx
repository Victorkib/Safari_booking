import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getVehicleById } from '@/app/actions/vehicles'
import { VehicleForm } from '@/components/vehicle-form'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'

interface EditVehiclePageProps {
  params: Promise<{ id: string }>
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const { id } = await params
  const vehicle = await getVehicleById(id)

  if (!vehicle) notFound()

  return (
    <>
      <PageHeader
        title={`Edit ${vehicle.registration_number}`}
        description="Update vehicle details and compliance dates"
        actions={(
          <Link href="/admin/vehicles">
            <Button variant="outline">Back to Vehicles</Button>
          </Link>
        )}
      />
      <VehicleForm
        initialData={{
          id: vehicle.id,
          registration_number: vehicle.registration_number,
          vehicle_type: vehicle.vehicle_type,
          make_model: vehicle.make_model,
          seating_capacity: vehicle.seating_capacity,
          license_expiry: vehicle.license_expiry ?? undefined,
          insurance_expiry: vehicle.insurance_expiry ?? undefined,
          status: vehicle.status ?? 'active',
        }}
      />
    </>
  )
}
