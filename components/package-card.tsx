import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PackageCardProps {
  package: {
    id: string
    title: string
    description: string | null
    duration_days: number
    price: string
    difficulty_level: string | null
    group_size_min: number | null
    group_size_max: number | null
    destinations: string[] | null
    highlights: string[] | null
  }
}

export function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-4">
          <div>
            <CardTitle className="text-2xl">{pkg.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {pkg.duration_days} days adventure
            </CardDescription>
          </div>
          {pkg.difficulty_level && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent text-accent-foreground">
              {pkg.difficulty_level}
            </span>
          )}
        </div>
        <p className="text-muted-foreground">{pkg.description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {pkg.destinations && pkg.destinations.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Destinations</h4>
            <div className="flex flex-wrap gap-2">
              {pkg.destinations.map((dest) => (
                <span
                  key={dest}
                  className="px-2 py-1 text-sm bg-secondary text-secondary-foreground rounded"
                >
                  {dest}
                </span>
              ))}
            </div>
          </div>
        )}

        {pkg.highlights && pkg.highlights.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2">Highlights</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {pkg.highlights.slice(0, 3).map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {pkg.group_size_min && pkg.group_size_max && (
          <p className="text-sm text-muted-foreground">
            Group size: {pkg.group_size_min}-{pkg.group_size_max} people
          </p>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-muted-foreground">From</span>
            <span className="text-3xl font-bold text-primary">KES {pkg.price}</span>
          </div>

          <Link href={`/packages/${pkg.id}`} className="w-full">
            <Button className="w-full">View Details & Book</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
