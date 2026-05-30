import Link from 'next/link'
import { getEligibleDriverUsers } from '@/app/actions/users'
import { getAllVehicles } from '@/app/actions/vehicles'
import { DriverForm } from '@/components/driver-form'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/layout/page-header'

export default async function NewDriverPage() {
  const [eligibleUsers, vehicles] = await Promise.all([
    getEligibleDriverUsers(),
    getAllVehicles(),
  ])

  return (
    <>
      <PageHeader
        title="Add Driver"
        description="Create a driver profile linked to an existing user account"
        actions={(
          <Link href="/admin/drivers">
            <Button variant="outline">Back to Drivers</Button>
          </Link>
        )}
      />
      {eligibleUsers.length === 0 ? (
        <p className="text-muted-foreground">
          No eligible users. Create a user with role &quot;driver&quot; first (e.g. via sign-up or seed).
        </p>
      ) : (
        <DriverForm
          eligibleUsers={eligibleUsers}
          vehicles={vehicles.map((v) => ({
            id: v.id,
            registration_number: v.registration_number,
            make_model: v.make_model,
          }))}
        />
      )}
    </>
  )
}
