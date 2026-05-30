'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user as { role?: string; name?: string } | undefined
  const role = user?.role ?? 'customer'

  const dashboardHref =
    role === 'admin'
      ? '/admin/dashboard'
      : role === 'driver'
        ? '/driver/dashboard'
        : '/customer-dashboard'

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          🦁 Safari Adventures
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/packages" className="text-foreground hover:text-primary transition">
            Packages
          </Link>
          <Link href="/destinations" className="text-foreground hover:text-primary transition">
            Destinations
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition">
            About
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {session?.user ? (
            <>
              <Link href={dashboardHref}>
                <Button variant="outline">
                  {role === 'admin' ? 'Admin' : role === 'driver' ? 'Driver' : 'My Bookings'}
                </Button>
              </Link>
              <Button
                variant="ghost"
                onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.href = '/' } })}
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
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-border p-4 space-y-4">
          <Link href="/packages" className="block text-foreground hover:text-primary">
            Packages
          </Link>
          <Link href="/destinations" className="block text-foreground hover:text-primary">
            Destinations
          </Link>
          <Link href="/about" className="block text-foreground hover:text-primary">
            About
          </Link>
          {session?.user ? (
            <>
              <Link href={dashboardHref} className="block text-foreground hover:text-primary">
                Dashboard
              </Link>
              <button
                className="block text-foreground hover:text-primary text-left"
                onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.href = '/' } })}
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
