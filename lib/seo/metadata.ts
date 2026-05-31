import type { Metadata } from 'next'
import {
  DEFAULT_OG_IMAGE_PATH,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TAGLINE,
  absoluteUrl,
  getSiteUrl,
} from './site'

export type PageMetadataInput = {
  title?: string
  description?: string
  path: string
  /** Site-relative image path (defaults to /og-image.jpg). */
  imagePath?: string
  /** Fully qualified image URL (e.g. external package photo). Overrides imagePath. */
  imageUrl?: string
  keywords?: string[]
  noIndex?: boolean
}

const defaultTitle = `${SITE_NAME} — ${SITE_TAGLINE}`

export function createPageMetadata(input: PageMetadataInput): Metadata {
  const title = input.title ? `${input.title} | ${SITE_NAME}` : defaultTitle
  const description = input.description ?? SITE_DESCRIPTION
  const canonical = absoluteUrl(input.path)
  const imageUrl = input.imageUrl ?? absoluteUrl(input.imagePath ?? DEFAULT_OG_IMAGE_PATH)
  const siteUrl = getSiteUrl()

  return {
    title,
    description,
    keywords: input.keywords ?? SITE_KEYWORDS,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: canonical,
      siteName: SITE_NAME,
      title: input.title ? `${input.title} | ${SITE_NAME}` : SITE_NAME,
      description,
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl.startsWith('https') ? imageUrl : undefined,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Kenya safari experiences`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title ? `${input.title} | ${SITE_NAME}` : SITE_NAME,
      description,
      images: [imageUrl],
    },
    robots: input.noIndex
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
        },
  }
}

/** Root layout defaults (title template, icons, verification hooks). */
export function createRootMetadata(): Metadata {
  const siteUrl = getSiteUrl()

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: siteUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'travel',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      type: 'website',
      locale: SITE_LOCALE,
      url: siteUrl,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [
        {
          url: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
          secureUrl: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
          width: 1200,
          height: 630,
          alt: 'Sunset over the African savannah — Safari Adventures',
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
    },
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    },
    manifest: '/manifest.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export const PORTAL_NOINDEX_METADATA = createPageMetadata({
  title: 'Portal',
  description: 'Safari Adventures account portal.',
  path: '/',
  noIndex: true,
})
