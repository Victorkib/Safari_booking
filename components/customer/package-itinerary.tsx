import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

type ItineraryDay = {
  id: string
  day_number: number
  title: string
  description: string | null
  activities: string[] | null
  accommodation: string | null
}

interface PackageItineraryProps {
  days: ItineraryDay[]
}

export function PackageItinerary({ days }: PackageItineraryProps) {
  if (days.length === 0) return null

  return (
    <Card className="mb-8 border-border/80">
      <CardHeader>
        <CardTitle className="font-display text-xl">Day-by-day itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-0">
          {days.map((day, index) => (
            <li key={day.id} className="relative pb-8 pl-8 last:pb-0">
              {index < days.length - 1 && (
                <span
                  className="absolute left-[11px] top-8 h-full w-px bg-border"
                  aria-hidden
                />
              )}
              <span className="absolute left-0 top-1 flex size-6 items-center justify-center rounded-full border-2 border-secondary bg-secondary/15 text-xs font-bold text-secondary-foreground">
                {day.day_number}
              </span>
              <p className="font-display font-semibold text-foreground">
                {day.title}
              </p>
              {day.description && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {day.description}
                </p>
              )}
              {day.activities && day.activities.length > 0 && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {day.activities.map((a) => (
                    <li key={a} className="flex items-start gap-2">
                      <span className="text-secondary">•</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
              {day.accommodation && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  {day.accommodation}
                </p>
              )}
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
