import { Car, Mail, Shield, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface DriverAssignmentCardProps {
  driverName: string
  driverEmail: string
  licenseNumber?: string | null
  experienceYears?: number | null
  vehicle?: {
    make_model: string
    registration_number: string
    vehicle_type: string
  } | null
}

export function DriverAssignmentCard({
  driverName,
  driverEmail,
  licenseNumber,
  experienceYears,
  vehicle,
}: DriverAssignmentCardProps) {
  return (
    <Card className="border-secondary/30 bg-gradient-to-br from-card to-secondary/5">
      <CardHeader>
        <CardTitle className="font-display text-xl">Your Safari Guide</CardTitle>
        <CardDescription>
          Your assigned driver and vehicle for this journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="size-6" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{driverName}</p>
            <a
              href={`mailto:${driverEmail}`}
              className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
            >
              <Mail className="size-3.5" />
              {driverEmail}
            </a>
            {(licenseNumber || experienceYears) && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="size-3.5" />
                {licenseNumber && `License ${licenseNumber}`}
                {licenseNumber && experienceYears ? ' · ' : ''}
                {experienceYears ? `${experienceYears} years experience` : ''}
              </p>
            )}
          </div>
        </div>

        {vehicle && (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Car className="mt-0.5 size-5 text-secondary" />
              <div>
                <p className="text-sm font-semibold">{vehicle.make_model}</p>
                <p className="text-xs text-muted-foreground">
                  {vehicle.vehicle_type} · {vehicle.registration_number}
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Your guide will reach out before departure with pickup details and a pre-trip briefing.
        </p>
      </CardContent>
    </Card>
  )
}
