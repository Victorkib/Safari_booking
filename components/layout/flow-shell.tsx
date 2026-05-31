'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { signOut, useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { BookingFlowStepper } from '@/components/layout/booking-flow-stepper'
import { Compass, Globe, Home, LayoutDashboard, LogOut } from 'lucide-react'
import { getDashboardHref, getPortalButtonLabel } from '@/lib/navigation'

interface FlowShellProps {
  children: React.ReactNode
}

export function FlowShell({ children }: FlowShellProps) {
  const { data: session } = useSession()
  const role = (session?.user as { role?: string } | undefined)?.role
  const portalHref = getDashboardHref(role)
  const portalLabel = getPortalButtonLabel(role)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 px-4 sm:px-6">
          <BrandLogo href="/" size="sm" className="shrink-0" />
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex" asChild>
              <Link href="/packages">
                <Compass className="size-4" />
                <span className="hidden md:inline">Safaris</span>
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:inline-flex" asChild>
              <Link href="/">
                <Home className="size-4" />
                <span className="hidden md:inline">Home</span>
              </Link>
            </Button>
            {session?.user && (
              <Button variant="ghost" size="sm" className="gap-1.5" asChild>
                <Link href={portalHref}>
                  <LayoutDashboard className="size-4" />
                  <span className="hidden sm:inline">{portalLabel}</span>
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
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
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <BookingFlowStepper />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">{children}</div>
      </main>

      <footer className="border-t border-border py-4">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-4 px-4 text-xs text-muted-foreground sm:justify-between sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-foreground">
            <Globe className="size-3" />
            Back to public site
          </Link>
          {session?.user && (
            <Link href={portalHref} className="hover:text-foreground">
              ← {portalLabel}
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}
