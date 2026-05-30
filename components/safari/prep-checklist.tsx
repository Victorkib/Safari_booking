import { CheckCircle2 } from 'lucide-react'

const DEFAULT_ITEMS = [
  'Vehicle inspected, fueled, and equipped',
  'Communication devices charged and tested',
  'First aid kit and emergency supplies verified',
  'Route and park entry permits confirmed',
  'Weather and road conditions reviewed',
  'Guest contact details verified with operations',
]

interface PrepChecklistProps {
  items?: string[]
  title?: string
  description?: string
}

/** Read-only field prep guide — no fake save/checkbox state */
export function PrepChecklist({
  items = DEFAULT_ITEMS,
  title = 'Field preparation guide',
  description = 'Complete these checks before departure. Contact operations if anything is outstanding.',
}: PrepChecklistProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-display text-lg font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm"
          >
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
