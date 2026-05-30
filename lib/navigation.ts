import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  Calendar,
  CreditCard,
  FileText,
  Package,
  BarChart3,
  History,
  User,
  MessageSquare,
  BookOpen,
  Compass,
  MapPin,
  Home,
  Car,
  Users,
} from 'lucide-react'

export type UserRole = 'admin' | 'driver' | 'customer'
export type ShellVariant = 'admin' | 'driver' | 'customer'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  /** Links to marketing / public pages outside the portal shell */
  external?: boolean
}

export type ShellConfig = {
  variant: ShellVariant
  portalTitle: string
  portalSubtitle: string
  homeHref: string
  roleLabel: string
  accentBorderClass: string
  /** Portal-internal navigation */
  navItems: NavItem[]
  /** Marketing site links (shown in a separate sidebar group) */
  publicNavItems: NavItem[]
}

/** Shared links back to the public marketing site — all roles */
export const publicSiteNav: NavItem[] = [
  { title: 'Public Home', href: '/', icon: Home, external: true },
  { title: 'Browse Safaris', href: '/packages', icon: Compass, external: true },
  { title: 'Destinations', href: '/destinations', icon: MapPin, external: true },
  { title: 'Contact', href: '/contact', icon: MessageSquare, external: true },
]

export const adminNav: NavItem[] = [
  { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Bookings', href: '/admin/bookings', icon: Calendar },
  { title: 'Payments', href: '/admin/payments', icon: CreditCard },
  { title: 'Invoices', href: '/admin/invoices', icon: FileText },
  { title: 'Packages', href: '/admin/packages', icon: Package },
  { title: 'Drivers', href: '/admin/drivers', icon: Users },
  { title: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
]

export const driverNav: NavItem[] = [
  { title: 'Dashboard', href: '/driver/dashboard', icon: LayoutDashboard },
  { title: 'Schedule', href: '/driver/schedule', icon: Calendar },
  { title: 'History', href: '/driver/history', icon: History },
  { title: 'Profile', href: '/driver/profile', icon: User },
]

export const customerPortalNav: NavItem[] = [
  { title: 'My Bookings', href: '/customer-dashboard', icon: BookOpen },
]

export const shellConfigs: Record<ShellVariant, ShellConfig> = {
  admin: {
    variant: 'admin',
    portalTitle: 'Admin Console',
    portalSubtitle: 'Operations & management',
    homeHref: '/admin/dashboard',
    roleLabel: 'Administrator',
    accentBorderClass: 'border-l-primary',
    navItems: adminNav,
    publicNavItems: publicSiteNav,
  },
  driver: {
    variant: 'driver',
    portalTitle: 'Driver Portal',
    portalSubtitle: 'Tours & field operations',
    homeHref: '/driver/dashboard',
    roleLabel: 'Driver',
    accentBorderClass: 'border-l-accent',
    navItems: driverNav,
    publicNavItems: publicSiteNav,
  },
  customer: {
    variant: 'customer',
    portalTitle: 'My Safaris',
    portalSubtitle: 'Your bookings & trips',
    homeHref: '/customer-dashboard',
    roleLabel: 'Customer',
    accentBorderClass: 'border-l-secondary',
    navItems: customerPortalNav,
    publicNavItems: publicSiteNav,
  },
}

export const pathLabels: Record<string, string> = {
  admin: 'Admin',
  driver: 'Driver',
  dashboard: 'Dashboard',
  bookings: 'Bookings',
  payments: 'Payments',
  invoices: 'Invoices',
  packages: 'Packages',
  drivers: 'Drivers',
  vehicles: 'Vehicles',
  reports: 'Reports',
  schedule: 'Schedule',
  history: 'History',
  profile: 'Profile',
  messages: 'Messages',
  tours: 'Tours',
  'customer-dashboard': 'My Bookings',
  booking: 'Booking',
  payment: 'Payment',
  success: 'Success',
  new: 'New',
  edit: 'Edit',
}

export function getDashboardHref(role: string | null | undefined): string {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'driver') return '/driver/dashboard'
  return '/customer-dashboard'
}

export function getPortalButtonLabel(role: string | null | undefined): string {
  if (role === 'admin') return 'Admin Console'
  if (role === 'driver') return 'Driver Portal'
  return 'My Bookings'
}

export function getNavItemsForRole(role: UserRole): NavItem[] {
  if (role === 'admin') return adminNav
  if (role === 'driver') return driverNav
  return customerPortalNav
}

export function getShellConfig(variant: ShellVariant): ShellConfig {
  return shellConfigs[variant]
}
