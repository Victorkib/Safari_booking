import { getPackageById } from '@/app/actions/packages'
import { getItinerariesByPackageId } from '@/app/actions/itineraries'
import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/booking-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'

interface PackageDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function PackageDetail({ params }: PackageDetailPageProps) {
  const { id } = await params
  const pkg = await getPackageById(id)
  const itineraryDays = await getItinerariesByPackageId(id)

  if (!pkg) {
    notFound()
  }

  return (
    <div className="py-12">
      <PageHeader
        title={pkg.title}
        actions={(
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{pkg.duration_days} Days</span>
            {pkg.difficulty_level && <span>•</span>}
            {pkg.difficulty_level && <span className="capitalize">{pkg.difficulty_level}</span>}
            {pkg.group_size_min && <span>•</span>}
            {pkg.group_size_min && <span>Group: {pkg.group_size_min}-{pkg.group_size_max}</span>}
          </div>
        )}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">

            {pkg.description && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{pkg.description}</p>
                </CardContent>
              </Card>
            )}

            {itineraryDays.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Day-by-Day Itinerary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {itineraryDays.map((day) => (
                    <div key={day.id} className="border-l-4 border-primary pl-4">
                      <p className="font-semibold text-foreground">
                        Day {day.day_number}: {day.title}
                      </p>
                      {day.description && (
                        <p className="text-sm text-muted-foreground mt-1">{day.description}</p>
                      )}
                      {day.activities && day.activities.length > 0 && (
                        <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                          {day.activities.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      )}
                      {day.accommodation && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Stay: {day.accommodation}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {pkg.destinations && pkg.destinations.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Destinations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {pkg.destinations.map((dest) => (
                      <span
                        key={dest}
                        className="px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium"
                      >
                        {dest}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {pkg.highlights && pkg.highlights.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <span className="text-accent text-xl mt-1">✓</span>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {pkg.included_services && pkg.included_services.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What&apos;s Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkg.included_services.map((service) => (
                      <li key={service} className="flex items-start gap-2">
                        <span className="text-primary">→</span>
                        <span className="text-muted-foreground">{service}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {pkg.excluded_items && pkg.excluded_items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Not Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pkg.excluded_items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="text-destructive">×</span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="text-3xl">KES {pkg.price}</CardTitle>
              <CardDescription>Per person</CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm packageId={pkg.id} price={pkg.price} duration={pkg.duration_days} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
