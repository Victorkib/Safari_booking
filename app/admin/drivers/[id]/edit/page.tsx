import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDriverById } from '@/app/actions/drivers'
import { getAllVehicles } from '@/app/actions/vehicles'
import { DriverForm } from '@/components/driver-form'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'

interface EditDriverPageProps {
  params: Promise<{ id: string }>
}

export default async function EditDriverPage({ params }: EditDriverPageProps) {
  const { id } = await params
  const [driver, vehicles] = await Promise.all([getDriverById(id), getAllVehicles()])

  if (!driver) notFound()

  return (
    <>
      <PageHeader
        title={`Edit ${driver.name}`}
        description="Update license, vehicle assignment, and availability"
        actions={(
          <Link href="/admin/drivers">
            <Button variant="outline">Back to Drivers</Button>
          </Link>
        )}
      />
      <DriverForm
        eligibleUsers={[]}
        vehicles={vehicles.map((v) => ({
          id: v.id,
          registration_number: v.registration_number,
          make_model: v.make_model,
        }))}
        initialData={driver}
      />
    </>
  )
}
