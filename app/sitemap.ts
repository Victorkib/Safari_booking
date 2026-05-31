import type { MetadataRoute } from 'next'
import { getAllPackages } from '@/app/actions/packages'
import { getSiteUrl } from '@/lib/seo/site'

const PUBLIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/packages', changeFrequency: 'daily', priority: 0.9 },
  { path: '/destinations', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/booking-policy', changeFrequency: 'yearly', priority: 0.4 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = PUBLIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  let packageEntries: MetadataRoute.Sitemap = []
  try {
    const packages = await getAllPackages()
    packageEntries = packages.map((pkg) => ({
      url: `${siteUrl}/packages/${pkg.id}`,
      lastModified: pkg.updated_at ?? pkg.created_at ?? now,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }))
  } catch {
    // DB unavailable at build time — static routes still ship
  }

  return [...staticEntries, ...packageEntries]
}
