import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Compass } from 'lucide-react'

interface EmptySafariProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptySafari({ title, description, actionLabel, actionHref }: EmptySafariProps) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed border-border/80 bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
        <Compass className="size-8" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild className="mt-6">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  )
}
