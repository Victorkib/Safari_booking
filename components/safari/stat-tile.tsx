import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatTileProps {
  label: string
  value: string | number
  description?: string
  icon?: LucideIcon
  className?: string
  accent?: 'primary' | 'gold' | 'muted'
}

const accentMap = {
  primary: 'text-primary',
  gold: 'text-secondary',
  muted: 'text-muted-foreground',
}

export function StatTile({
  label,
  value,
  description,
  icon: Icon,
  className,
  accent = 'primary',
}: StatTileProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className={cn('mt-2 font-display text-3xl font-semibold tracking-tight', accentMap[accent])}>
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
            <Icon className="size-5" />
          </div>
        )}
      </div>
    </div>
  )
}
