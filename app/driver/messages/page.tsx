import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function DriverMessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Link href="/driver/dashboard"><Button variant="outline">Back</Button></Link>
        </div>
        <Card>
          <CardHeader><CardTitle>Guest Communications</CardTitle></CardHeader>
          <CardContent className="text-muted-foreground text-center py-12">
            In-app messaging coming soon. For now, contact operations via your admin coordinator.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
