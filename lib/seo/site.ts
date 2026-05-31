/** Public marketing site configuration (SEO, branding, structured data). */

export const SITE_NAME = 'Safari Adventures'
export const SITE_TAGLINE = 'Book Your African Safari'
export const SITE_DESCRIPTION =
  'Discover unforgettable safari packages across Kenya\'s premier wildlife destinations — Maasai Mara, Amboseli, Samburu, and beyond. Expert guides, curated itineraries, secure M-Pesa booking.'

export const SITE_KEYWORDS = [
  'Kenya safari',
  'African safari booking',
  'Maasai Mara tours',
  'wildlife safari packages',
  'Amboseli safari',
  'Samburu safari',
  'luxury safari Kenya',
  'safari holidays Kenya',
  'Nairobi safari tours',
]

export const SITE_LOCALE = 'en_KE'
export const SITE_COUNTRY = 'Kenya'
export const SITE_EMAIL = 'info@safariadventures.com'
export const SITE_PHONE = '+254123456789'

export const SOCIAL_LINKS = {
  twitter: 'https://twitter.com/safariadventures',
  instagram: 'https://instagram.com/safariadventures',
  facebook: 'https://facebook.com/safariadventures',
} as const

export const DEFAULT_OG_IMAGE_PATH = '/og-image.jpg'
export const LOGO_PATH = '/logo.png'

/** Resolve canonical site origin (no trailing slash). */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.SITE_URL,
    process.env.BETTER_AUTH_URL,
    process.env.URL, // Netlify primary site URL
    process.env.DEPLOY_PRIME_URL, // Netlify production deploy URL
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ]

  const raw = candidates.find((v) => v?.trim())?.trim() ?? 'http://localhost:3000'
  return raw.replace(/\/$/, '')
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}
