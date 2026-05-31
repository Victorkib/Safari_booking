import { CustomerShell } from '@/components/layout/customer-shell'
import { createPageMetadata } from '@/lib/seo/metadata'

export const metadata = createPageMetadata({
  title: 'My Dashboard',
  path: '/customer-dashboard',
  noIndex: true,
})

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <CustomerShell>{children}</CustomerShell>
}
