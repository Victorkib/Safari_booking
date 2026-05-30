import { AppShell } from '@/components/layout/app-shell'

export default function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell variant="driver">{children}</AppShell>
}
