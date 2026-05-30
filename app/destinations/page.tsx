import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getAllDestinations } from '@/app/actions/destinations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DestinationsPage() {
  const destinations = await getAllDestinations()

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Safari Destinations</h1>
            <p className="text-lg text-muted-foreground">
              Explore Kenya&apos;s premier wildlife parks and conservancies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Card key={dest.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{dest.name}</CardTitle>
                  <CardDescription>
                    {dest.region}, {dest.country}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dest.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {dest.description}
                    </p>
                  )}
                  {dest.best_season && (
                    <p className="text-xs text-muted-foreground">
                      <strong>Best season:</strong> {dest.best_season}
                    </p>
                  )}
                  {dest.wildlife && dest.wildlife.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dest.wildlife.slice(0, 4).map((animal) => (
                        <span
                          key={animal}
                          className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground"
                        >
                          {animal}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {destinations.length === 0 && (
            <p className="text-center text-muted-foreground py-12">
              No destinations yet. Run <code className="text-sm">npm run db:seed</code> to populate sample data.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
