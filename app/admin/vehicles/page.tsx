import { getAllVehicles } from '@/app/actions/vehicles'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteVehicleButton } from '@/components/delete-vehicle-button'
import { PageHeader } from '@/components/layout/page-header'
import Link from 'next/link'

export default async function AdminVehiclesPage() {
  const vehicles = await getAllVehicles()

  return (
    <>
      <PageHeader
        title="Vehicles"
        description="Manage the safari fleet"
        actions={(
          <Link href="/admin/vehicles/new">
            <Button>Add Vehicle</Button>
          </Link>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Fleet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{vehicles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">
              {vehicles.filter((v) => v.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-700">
              {vehicles.filter((v) => v.status === 'maintenance').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="font-mono">{vehicle.registration_number}</CardTitle>
              <CardDescription>{vehicle.make_model}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="capitalize">{vehicle.vehicle_type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Seats</p>
                  <p>{vehicle.seating_capacity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="capitalize">{vehicle.status}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Link href={`/admin/vehicles/${vehicle.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">Edit</Button>
                </Link>
                <DeleteVehicleButton vehicleId={vehicle.id} registration={vehicle.registration_number} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="pt-8 text-center text-muted-foreground">
            No vehicles in the fleet yet.
          </CardContent>
        </Card>
      )}
    </>
  )
}
