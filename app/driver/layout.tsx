import { AppShell } from '@/components/layout/app-shell'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({
  title: 'Driver Portal',
  path: '/driver',
  noIndex: true,
})

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell variant="driver">{children}</AppShell>
}
