import { AppShell } from '@/components/layout/app-shell'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({
  title: 'Admin',
  path: '/admin',
  noIndex: true,
})

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell variant="admin">{children}</AppShell>
}
