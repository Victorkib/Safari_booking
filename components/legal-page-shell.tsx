import { PageHeader } from '@/components/layout/page-header'

interface LegalPageShellProps {
  title: string
  description: string
  children: React.ReactNode
}

export function LegalPageShell({ title, description, children }: LegalPageShellProps) {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader title={title} description={description} />
        <div className="space-y-6 text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </main>
  )
}
