import { FlowShell } from '@/components/layout/flow-shell'

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FlowShell>{children}</FlowShell>
}
