import Link from 'next/link'
import { Info } from 'lucide-react'

export function AdminPreviewBanner() {
  return (
    <div
      role="status"
      className="mb-6 flex gap-3 rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 text-sm text-foreground"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <div>
        <p className="font-medium">Admin preview mode</p>
        <p className="mt-1 text-muted-foreground">
          You can browse packages for reference. Bookings must be created on behalf of customers — you cannot book for yourself.
        </p>
        <Link
          href="/admin/bookings/new"
          className="mt-2 inline-block font-medium text-primary hover:underline"
        >
          Create booking for customer →
        </Link>
      </div>
    </div>
  )
}
