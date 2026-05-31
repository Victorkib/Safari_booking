import {
  SITE_COUNTRY,
  SITE_DESCRIPTION,
  SITE_EMAIL,
  SITE_NAME,
  SITE_PHONE,
  SOCIAL_LINKS,
  absoluteUrl,
  getSiteUrl,
} from './site'

type JsonLd = Record<string, unknown>

export function organizationJsonLd(): JsonLd {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${url}/#organization`,
    name: SITE_NAME,
    url,
    logo: absoluteUrl('/logo.png'),
    image: absoluteUrl('/og-image.jpg'),
    description: SITE_DESCRIPTION,
    email: SITE_EMAIL,
    telephone: SITE_PHONE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Nairobi',
      addressCountry: SITE_COUNTRY,
    },
    areaServed: {
      '@type': 'Country',
      name: SITE_COUNTRY,
    },
    sameAs: [SOCIAL_LINKS.facebook, SOCIAL_LINKS.instagram, SOCIAL_LINKS.twitter],
  }
}

export function websiteJsonLd(): JsonLd {
  const url = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: SITE_NAME,
    url,
    description: SITE_DESCRIPTION,
    publisher: { '@id': `${url}/#organization` },
    inLanguage: 'en-KE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/packages?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function touristTripJsonLd(pkg: {
  id: string
  title: string
  description?: string | null
  price: string
  duration_days: number
  destinations?: string[] | null
  images?: string[] | null
}): JsonLd {
  const url = absoluteUrl(`/packages/${pkg.id}`)
  const image =
    pkg.images?.[0]?.startsWith('http')
      ? pkg.images[0]
      : pkg.images?.[0]
        ? absoluteUrl(pkg.images[0].startsWith('/') ? pkg.images[0] : `/${pkg.images[0]}`)
        : absoluteUrl('/og-image.jpg')

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: pkg.title,
    description: pkg.description ?? undefined,
    url,
    image,
    touristType: 'Wildlife safari',
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: pkg.duration_days,
      name: `${pkg.duration_days}-day safari itinerary`,
    },
    offers: {
      '@type': 'Offer',
      price: pkg.price,
      priceCurrency: 'KES',
      availability: 'https://schema.org/InStock',
      url,
      seller: { '@id': `${getSiteUrl()}/#organization` },
    },
    ...(pkg.destinations?.length
      ? { destination: pkg.destinations.map((name) => ({ '@type': 'Place', name })) }
      : {}),
  }
}

export function faqPageJsonLd(
  entries: { question: string; answer: string }[]
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  }
}
