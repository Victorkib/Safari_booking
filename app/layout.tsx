import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { JsonLd } from '@/components/seo/json-ld'
import { createRootMetadata } from '@/lib/seo/metadata'
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo/json-ld'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata = createRootMetadata()

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-KE">
      <body
        className={`${geist.variable} ${geistMono.variable} ${playfair.variable} font-sans antialiased`}
      >
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        {children}
      </body>
    </html>
  )
}
