'use client'

import Link from 'next/link'
import { BrandLogo } from '@/components/brand/brand-logo'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { getShellConfig, type ShellVariant } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { ExternalLink, Home } from 'lucide-react'

interface AppSidebarProps {
  variant: ShellVariant
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === '/customer-dashboard') {
    return pathname === '/customer-dashboard'
  }
  if (href === '/admin/dashboard' || href === '/driver/dashboard') {
    return pathname === href
  }
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string
  items: { title: string; href: string; icon: React.ComponentType<{ className?: string }>; external?: boolean }[]
  pathname: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = !item.external && isActivePath(pathname, item.href)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                    {item.external && (
                      <ExternalLink className="ml-auto size-3 opacity-50 group-data-[collapsible=icon]:hidden" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export function AppSidebar({ variant }: AppSidebarProps) {
  const pathname = usePathname()
  const config = getShellConfig(variant)

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader
        className={cn('border-l-4 pl-3', config.accentBorderClass)}
      >
        <div className="flex flex-col gap-2 px-2 py-2 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
          <BrandLogo
            href={config.homeHref}
            size="sm"
            showWordmark={false}
            className="group-data-[collapsible=icon]:justify-center"
          />
          <div className="group-data-[collapsible=icon]:hidden">
            <p className="text-sm font-bold text-sidebar-foreground">Safari Adventures</p>
            <p className="text-xs font-semibold text-primary">{config.portalTitle}</p>
            <p className="text-[10px] text-muted-foreground">{config.portalSubtitle}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <NavGroup label="Portal" items={config.navItems} pathname={pathname} />
        <SidebarSeparator className="mx-2" />
        <NavGroup label="Public Site" items={config.publicNavItems} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter className="gap-2 p-2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
        >
          <Home className="size-3.5 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">Back to public site</span>
        </Link>
        <p className="px-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          {config.roleLabel} access
        </p>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
