import type { Metadata } from 'next'
import { getPackageById } from '@/app/actions/packages'
import { getItinerariesByPackageId } from '@/app/actions/itineraries'
import { getSession } from '@/lib/auth'
import { AdminPreviewBanner } from '@/components/admin/admin-preview-banner'
import { JsonLd } from '@/components/seo/json-ld'
import { createPageMetadata } from '@/lib/seo/metadata'
import { breadcrumbJsonLd, touristTripJsonLd } from '@/lib/seo/json-ld'
import { notFound } from 'next/navigation'
import { PackageHero } from '@/components/customer/package-hero'
import { PackageBookingPanel } from '@/components/customer/package-booking-panel'
import { PackageItinerary } from '@/components/customer/package-itinerary'
import { PackageDetails } from '@/components/customer/package-details'

interface PackageDetailPageProps {
  params: Promise<{ id: string }>
}

function packageOgImage(images?: string[] | null): string | undefined {
  const first = images?.[0]
  if (!first) return undefined
  if (first.startsWith('http://') || first.startsWith('https://')) return first
  return first.startsWith('/') ? first : `/${first}`
}

export async function generateMetadata({ params }: PackageDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const pkg = await getPackageById(id)
  if (!pkg) {
    return createPageMetadata({
      title: 'Package not found',
      description: 'This safari package could not be found.',
      path: `/packages/${id}`,
      noIndex: true,
    })
  }

  const summary =
    pkg.description?.replace(/\s+/g, ' ').trim().slice(0, 155) ||
    `${pkg.duration_days}-day safari in ${(pkg.destinations ?? []).join(', ') || 'Kenya'}. Book with Safari Adventures.`

  const og = packageOgImage(pkg.images)
  return createPageMetadata({
    title: pkg.title,
    description: summary,
    path: `/packages/${id}`,
    ...(og?.startsWith('http') ? { imageUrl: og } : og ? { imagePath: og } : {}),
  })
}

export default async function PackageDetail({ params }: PackageDetailPageProps) {
  const { id } = await params
  const pkg = await getPackageById(id)
  const itineraryDays = await getItinerariesByPackageId(id)

  if (!pkg) {
    notFound()
  }

  const session = await getSession()
  const userRole = (session?.user as { role?: string } | undefined)?.role ?? null
  const signInHref = `/sign-in?callbackUrl=${encodeURIComponent(`/packages/${id}`)}`
  const groupSizeMin = pkg.group_size_min ?? 1
  const groupSizeMax = pkg.group_size_max ?? 20

  return (
    <div className="py-8 sm:py-12">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Packages', path: '/packages' },
            { name: pkg.title, path: `/packages/${pkg.id}` },
          ]),
          touristTripJsonLd(pkg),
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {userRole === 'admin' && <AdminPreviewBanner />}
        <PackageHero
          packageId={pkg.id}
          title={pkg.title}
          destinations={pkg.destinations}
          durationDays={pkg.duration_days}
          difficultyLevel={pkg.difficulty_level}
          groupSizeMin={groupSizeMin}
          groupSizeMax={groupSizeMax}
          price={pkg.price}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PackageItinerary days={itineraryDays} />
            <PackageDetails
              description={pkg.description}
              destinations={pkg.destinations}
              highlights={pkg.highlights}
              includedServices={pkg.included_services}
              excludedItems={pkg.excluded_items}
            />
          </div>

          <div className="lg:col-span-1">
            <PackageBookingPanel
              packageId={pkg.id}
              title={pkg.title}
              price={pkg.price}
              durationDays={pkg.duration_days}
              groupSizeMin={groupSizeMin}
              groupSizeMax={groupSizeMax}
              isSignedIn={!!session?.user}
              signInHref={signInHref}
              userRole={userRole}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
