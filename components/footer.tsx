import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { SOCIAL_LINKS } from '@/lib/seo/site'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <BrandLogo href="/" variant="light" size="md" className="mb-4" />
            <p className="text-sm opacity-80">
              Experience Africa&apos;s most incredible wildlife destinations with expert guides.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/about" className="hover:opacity-100 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-100 transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link href="/faq" className="hover:opacity-100 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/booking-policy" className="hover:opacity-100 transition">
                  Booking Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:opacity-100 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Email: info@safariadventures.com</li>
              <li>Phone: +254 (0) 123 456 789</li>
              <li>Address: Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 flex items-center justify-between text-sm opacity-80">
          <p>&copy; {currentYear} Safari Adventures. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href={SOCIAL_LINKS.twitter}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:opacity-100 transition"
            >
              Twitter
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:opacity-100 transition"
            >
              Instagram
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              rel="noopener noreferrer"
              target="_blank"
              className="hover:opacity-100 transition"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
