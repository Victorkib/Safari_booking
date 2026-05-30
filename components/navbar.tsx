'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { getDashboardHref, getPortalButtonLabel } from '@/lib/navigation'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user as { role?: string; name?: string } | undefined
  const role = user?.role ?? 'customer'
  const dashboardHref = getDashboardHref(role)
  const portalLabel = getPortalButtonLabel(role)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-2xl font-semibold text-primary">
          Safari Adventures
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/packages" className="text-foreground transition hover:text-primary">
            Packages
          </Link>
          <Link href="/destinations" className="text-foreground transition hover:text-primary">
            Destinations
          </Link>
          <Link href="/about" className="text-foreground transition hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="text-foreground transition hover:text-primary">
            Contact
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {session?.user ? (
            <>
              <Link href={dashboardHref}>
                <Button variant="outline">{portalLabel}</Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() =>
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/'
                      },
                    },
                  })
                }
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Book Now</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="space-y-4 border-t border-border p-4 md:hidden">
          <Link href="/packages" className="block text-foreground hover:text-primary">
            Packages
          </Link>
          <Link href="/destinations" className="block text-foreground hover:text-primary">
            Destinations
          </Link>
          <Link href="/about" className="block text-foreground hover:text-primary">
            About
          </Link>
          <Link href="/contact" className="block text-foreground hover:text-primary">
            Contact
          </Link>
          {session?.user ? (
            <>
              <Link href={dashboardHref} className="block text-foreground hover:text-primary">
                {portalLabel}
              </Link>
              <button
                className="block text-left text-foreground hover:text-primary"
                onClick={() =>
                  signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        window.location.href = '/'
                      },
                    },
                  })
                }
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="block text-foreground hover:text-primary">
                Sign In
              </Link>
              <Link href="/sign-up" className="block text-foreground hover:text-primary">
                Book Now
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
