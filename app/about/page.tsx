import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-6">About Safari Adventures</h1>
          <p className="text-lg text-muted-foreground mb-12">
            We are a Kenya-based safari operator dedicated to unforgettable wildlife experiences
            across East Africa&apos;s most iconic parks and conservancies.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                To connect travellers with Africa&apos;s wild places through responsible,
                expert-led safaris — while supporting local communities and conservation.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Why Choose Us</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Licensed guides, modern 4x4 fleet, handpicked lodges, and transparent pricing
                in Kenyan Shillings. From first-time visitors to seasoned photographers.
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li>→ Classic Big Five safaris in Maasai Mara &amp; Amboseli</li>
                <li>→ Family-friendly itineraries with shorter drive times</li>
                <li>→ Photography-focused trips with specialist guides</li>
                <li>→ Luxury fly-in camps in remote northern Kenya</li>
                <li>→ Full booking, payment tracking, and driver assignment</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
