import Link from 'next/link'
import { getDriverProfile } from '@/app/actions/drivers'
import { getVehicleById } from '@/app/actions/vehicles'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function DriverProfilePage() {
  const profile = await getDriverProfile()
  const vehicle = profile?.vehicle_id ? await getVehicleById(profile.vehicle_id) : null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Link href="/driver/dashboard"><Button variant="outline">Back</Button></Link>
        </div>

        {!profile ? (
          <Card>
            <CardContent className="pt-8 text-center text-muted-foreground">
              No driver profile found. Contact an admin to set up your account.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Personal Info</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Name:</strong> {profile.name}</p>
                <p><strong className="text-foreground">Email:</strong> {profile.email}</p>
                <p><strong className="text-foreground">Status:</strong> {profile.status}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>License</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p><strong className="text-foreground">Number:</strong> {profile.license_number}</p>
                <p><strong className="text-foreground">Expires:</strong> {new Date(profile.license_expiry).toLocaleDateString()}</p>
                <p><strong className="text-foreground">Experience:</strong> {profile.experience_years ?? 0} years</p>
              </CardContent>
            </Card>
            {vehicle && (
              <Card>
                <CardHeader><CardTitle>Assigned Vehicle</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                  <p><strong className="text-foreground">Vehicle:</strong> {vehicle.make_model}</p>
                  <p><strong className="text-foreground">Registration:</strong> {vehicle.registration_number}</p>
                  <p><strong className="text-foreground">Capacity:</strong> {vehicle.seating_capacity} seats</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
