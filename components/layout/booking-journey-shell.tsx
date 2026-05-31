'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from '@/lib/auth-client'
import { BookingFlowStepper } from '@/components/layout/booking-flow-stepper'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { BookOpen, Globe, LogOut } from 'lucide-react'

interface BookingJourneyShellProps {
  children: React.ReactNode
}

export function BookingJourneyShell({ children }: BookingJourneyShellProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const user = session?.user as { name?: string; email?: string } | undefined

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    '?'

  const stepLabel = pathname.endsWith('/payment')
    ? 'Payment'
    : pathname.endsWith('/success')
      ? 'Confirmation'
      : 'Review'

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between gap-3 px-4 sm:px-6">
          <BrandLogo href="/customer-dashboard" size="sm" showWordmark={false} />
          <p className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:block">
            Booking · {stepLabel}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/customer-dashboard">
                <BookOpen className="mr-1.5 size-4" />
                My trips
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/">
                <Globe className="mr-1.5 size-4" />
                Site
              </Link>
            </Button>
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 w-8 rounded-full p-0">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/10 text-xs text-primary">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/customer-dashboard">My trips</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
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
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <BookingFlowStepper />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">{children}</div>
      </main>

      <footer className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        <Link href="/booking-policy" className="hover:text-foreground">
          Booking policy
        </Link>
        {' · '}
        <Link href="/contact" className="hover:text-foreground">
          Need help?
        </Link>
      </footer>
    </div>
  )
}
