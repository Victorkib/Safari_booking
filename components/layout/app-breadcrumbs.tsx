'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { pathLabels, type ShellConfig } from '@/lib/navigation'

interface AppBreadcrumbsProps {
  config: ShellConfig
}

function formatSegment(segment: string): string {
  if (pathLabels[segment]) return pathLabels[segment]
  if (segment.length <= 12 && /^[a-zA-Z0-9_-]+$/.test(segment)) {
    return segment.charAt(0).toUpperCase() + segment.slice(1)
  }
  return `#${segment.slice(0, 8)}`
}

export function AppBreadcrumbs({ config }: AppBreadcrumbsProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  const crumbs: { label: string; href: string; isLast: boolean }[] = []
  let path = ''

  segments.forEach((segment, index) => {
    path += `/${segment}`
    crumbs.push({
      label: formatSegment(segment),
      href: path,
      isLast: index === segments.length - 1,
    })
  })

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={config.homeHref}>{config.portalTitle}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb) => (
          <span key={crumb.href} className="contents">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
