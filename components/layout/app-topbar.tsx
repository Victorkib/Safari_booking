'use client'

import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { AppBreadcrumbs } from '@/components/layout/app-breadcrumbs'
import { AppUserMenu } from '@/components/layout/app-user-menu'
import { getShellConfig, type ShellVariant } from '@/lib/navigation'
import { Globe } from 'lucide-react'

interface AppTopbarProps {
  variant: ShellVariant
}

export function AppTopbar({ variant }: AppTopbarProps) {
  const config = getShellConfig(variant)

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <div className="flex min-w-0 flex-1 items-center">
        <AppBreadcrumbs config={config} />
      </div>
      <Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex" asChild>
        <Link href="/">
          <Globe className="size-4" />
          View Site
        </Link>
      </Button>
      <AppUserMenu config={config} />
    </header>
  )
}
