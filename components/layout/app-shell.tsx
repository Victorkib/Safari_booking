'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppTopbar } from '@/components/layout/app-topbar'
import type { ShellVariant } from '@/lib/navigation'

interface AppShellProps {
  variant: ShellVariant
  children: React.ReactNode
}

export function AppShell({ variant, children }: AppShellProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar variant={variant} />
      <SidebarInset>
        <AppTopbar variant={variant} />
        <div className="flex flex-1 flex-col">
          <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
