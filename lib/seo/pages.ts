import { createPageMetadata } from './metadata'

export const seo = {
  home: createPageMetadata({
    description:
      'Book curated Kenya safari packages with expert guides. Maasai Mara, Amboseli, Samburu & more — secure online booking with M-Pesa.',
    path: '/',
  }),
  packages: createPageMetadata({
    title: 'Safari Packages',
    description:
      'Browse handpicked Kenya safari itineraries — wildlife, luxury lodges, and expert-led game drives. Compare packages and book online.',
    path: '/packages',
  }),
  destinations: createPageMetadata({
    title: 'Destinations',
    description:
      'Explore Kenya\'s top safari destinations: Maasai Mara, Amboseli, Lake Nakuru, Samburu, Tsavo, and the Great Rift Valley.',
    path: '/destinations',
  }),
  about: createPageMetadata({
    title: 'About Us',
    description:
      'Safari Adventures — locally rooted Kenya safari operator with experienced guides, vetted vehicles, and transparent booking.',
    path: '/about',
  }),
  contact: createPageMetadata({
    title: 'Contact',
    description:
      'Get in touch with Safari Adventures in Nairobi. Questions about packages, group bookings, or custom itineraries.',
    path: '/contact',
  }),
  faq: createPageMetadata({
    title: 'FAQ',
    description:
      'Answers about safari booking, M-Pesa payments, confirmations, packing, park fees, and travel policies.',
    path: '/faq',
  }),
  bookingPolicy: createPageMetadata({
    title: 'Booking Policy',
    description: 'Cancellation, date changes, deposits, and refund policy for Safari Adventures bookings.',
    path: '/booking-policy',
  }),
  privacy: createPageMetadata({
    title: 'Privacy Policy',
    description: 'How Safari Adventures collects, uses, and protects your personal data.',
    path: '/privacy',
  }),
  terms: createPageMetadata({
    title: 'Terms & Conditions',
    description: 'Terms of service for using the Safari Adventures website and booking platform.',
    path: '/terms',
  }),
  signIn: createPageMetadata({
    title: 'Sign In',
    path: '/sign-in',
    noIndex: true,
  }),
  signUp: createPageMetadata({
    title: 'Create Account',
    path: '/sign-up',
    noIndex: true,
  }),
} as const
