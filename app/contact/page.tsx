import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PageHeader } from '@/components/layout/page-header'

export default function ContactPage() {
  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Contact Us"
          description="Have questions about a safari package or need a custom itinerary? We&apos;re here to help."
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:hello@safariadventures.co.ke" className="text-primary hover:underline">
                  hello@safariadventures.co.ke
                </a>
              </p>
              <p>
                <strong className="text-foreground">Phone:</strong> +254 700 123 456
              </p>
              <p>
                <strong className="text-foreground">Office:</strong> Nairobi, Kenya
              </p>
              <p>
                <strong className="text-foreground">Hours:</strong> Mon–Sat, 8am–6pm EAT
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ready to Book?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Browse our packages online and complete your booking in minutes.
              </p>
              <Link href="/packages">
                <Button className="w-full">View Safari Packages</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full">
                  Create an Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
