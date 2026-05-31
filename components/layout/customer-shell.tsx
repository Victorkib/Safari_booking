'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { customerTopNav } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { Globe, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface CustomerShellProps {
  children: React.ReactNode
}

export function CustomerShell({ children }: CustomerShellProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
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

  const isActive = (href: string) => {
    if (href === '/customer-dashboard') {
      return pathname === '/customer-dashboard'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandLogo href="/customer-dashboard" size="md" />

          <nav className="hidden items-center gap-1 md:flex">
            {customerTopNav.map((item) => {
              const active = !item.external && isActive(item.href)
              return (
                <Button
                  key={item.href + item.title}
                  variant={active ? 'secondary' : 'ghost'}
                  size="sm"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-1.5 size-4" />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
              <Link href="/">
                <Globe className="mr-1.5 size-4" />
                Public site
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 pl-2 pr-3">
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate sm:inline">
                    {user?.name?.split(' ')[0] ?? 'Account'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">{user?.name ?? 'Traveler'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/customer-dashboard">My trips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/packages">Browse safaris</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/booking-policy">Booking policy</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
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

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="border-t border-border/80 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {customerTopNav.map((item) => (
                <Link
                  key={item.href + item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
                    !item.external && isActive(item.href)
                      ? 'bg-secondary/15 text-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="size-4" />
                  {item.title}
                </Link>
              ))}
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                <Globe className="size-4" />
                Public site
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>

      <footer className="border-t border-border/60 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-muted-foreground sm:justify-between sm:px-6 lg:px-8">
          <Link href="/faq" className="hover:text-foreground">
            Help &amp; FAQ
          </Link>
          <Link href="/booking-policy" className="hover:text-foreground">
            Booking policy
          </Link>
          <Link href="/contact" className="hover:text-foreground">
            Contact
          </Link>
        </div>
      </footer>
    </div>
  )
}
