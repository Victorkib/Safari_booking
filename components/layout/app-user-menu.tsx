'use client'

import Link from 'next/link'
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
import { Compass, Home, LayoutDashboard, LogOut, MapPin } from 'lucide-react'
import { getPortalButtonLabel, type ShellConfig } from '@/lib/navigation'

interface AppUserMenuProps {
  config: ShellConfig
}

export function AppUserMenu({ config }: AppUserMenuProps) {
  const { data: session } = useSession()
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined
  const role = user?.role

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    user?.email?.slice(0, 2).toUpperCase() ||
    '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            <p className="pt-1 text-xs leading-none text-primary">{config.roleLabel}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={config.homeHref} className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            {getPortalButtonLabel(role)}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs text-muted-foreground">Public site</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/" className="cursor-pointer">
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/packages" className="cursor-pointer">
            <Compass className="mr-2 h-4 w-4" />
            Browse Safaris
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/destinations" className="cursor-pointer">
            <MapPin className="mr-2 h-4 w-4" />
            Destinations
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
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
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
