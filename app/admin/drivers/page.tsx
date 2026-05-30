import { getAllDrivers } from '@/app/actions/drivers'
import { getAllVehicles } from '@/app/actions/vehicles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteDriverButton } from '@/components/delete-driver-button'
import { PageHeader } from '@/components/layout/page-header'
import Link from 'next/link'

export default async function AdminDriversPage() {
  const [drivers, vehicles] = await Promise.all([getAllDrivers(), getAllVehicles()])

  const vehicleMap = Object.fromEntries(
    vehicles.map((v) => [v.id, `${v.registration_number} (${v.make_model})`])
  )

  return (
    <>
      <PageHeader
        title="Drivers"
        description="Manage safari guides and field staff"
        actions={(
          <Link href="/admin/drivers/new">
            <Button>Add Driver</Button>
          </Link>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{drivers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              {drivers.filter((d) => d.status === 'available').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">On Tour</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-700">
              {drivers.filter((d) => d.status === 'on_tour').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Drivers</CardTitle>
          <CardDescription>Linked user accounts with license and vehicle details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Name</th>
                  <th className="text-left py-4 px-4 font-semibold">License</th>
                  <th className="text-left py-4 px-4 font-semibold">Experience</th>
                  <th className="text-left py-4 px-4 font-semibold">Vehicle</th>
                  <th className="text-left py-4 px-4 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <p className="font-semibold">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.email}</p>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs">{driver.license_number}</td>
                    <td className="py-4 px-4">{driver.experience_years ?? 0} yrs</td>
                    <td className="py-4 px-4 text-xs">
                      {driver.vehicle_id ? vehicleMap[driver.vehicle_id] ?? 'Assigned' : '—'}
                    </td>
                    <td className="py-4 px-4 capitalize">{driver.status}</td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Link href={`/admin/drivers/${driver.id}/edit`}>
                          <Button size="sm" variant="outline">Edit</Button>
                        </Link>
                        <DeleteDriverButton driverId={driver.id} driverName={driver.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {drivers.length === 0 && (
              <p className="text-center py-12 text-muted-foreground">No drivers yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
