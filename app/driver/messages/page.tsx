import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'

export default function DriverMessagesPage() {
  return (
    <>
      <PageHeader title="Messages" description="Guest and operations communication" />
      <Card>
        <CardHeader><CardTitle>Guest Communications</CardTitle></CardHeader>
        <CardContent className="text-muted-foreground text-center py-12">
          In-app messaging coming soon. For now, contact operations via your admin coordinator.
        </CardContent>
      </Card>
    </>
  )
}
