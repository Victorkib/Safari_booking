import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, X } from 'lucide-react'

interface PackageDetailsProps {
  description?: string | null
  destinations?: string[] | null
  highlights?: string[] | null
  includedServices?: string[] | null
  excludedItems?: string[] | null
}

export function PackageDetails({
  description,
  destinations,
  highlights,
  includedServices,
  excludedItems,
}: PackageDetailsProps) {
  return (
    <div className="space-y-8">
      {description && (
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-xl">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {description}
            </p>
          </CardContent>
        </Card>
      )}

      {destinations && destinations.length > 0 && (
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-xl">Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {destinations.map((dest) => (
                <span
                  key={dest}
                  className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-medium text-primary"
                >
                  {dest}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {highlights && highlights.length > 0 && (
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-xl">Highlights</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-secondary" />
                  {highlight}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {includedServices && includedServices.length > 0 && (
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-xl">What&apos;s included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {includedServices.map((service) => (
                <li key={service} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {service}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {excludedItems && excludedItems.length > 0 && (
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-display text-xl">Not included</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 sm:grid-cols-2">
              {excludedItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <X className="mt-0.5 size-4 shrink-0 text-destructive/80" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
