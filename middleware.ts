import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const adminRoutes = ['/admin']
const driverRoutes = ['/driver']
const authRoutes = ['/sign-in', '/sign-up']
const customerRoutes = ['/customer-dashboard', '/booking']

type MiddlewareSession = {
  user?: {
    id: string
    role?: string
  }
}

async function getSession(request: NextRequest): Promise<MiddlewareSession | null> {
  try {
    const response = await fetch(new URL('/api/auth/get-session', request.url), {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const data = (await response.json()) as MiddlewareSession | null
    return data?.user ? data : null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))
  const isDriverRoute = driverRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))
  const isCustomerRoute = customerRoutes.some((r) => pathname.startsWith(r))

  if (!isAdminRoute && !isDriverRoute && !isAuthRoute && !isCustomerRoute) {
    return NextResponse.next()
  }

  const session = await getSession(request)
  const role = session?.user?.role ?? 'customer'

  if (isAuthRoute && session?.user) {
    const redirectTo =
      role === 'admin'
        ? '/admin/dashboard'
        : role === 'driver'
          ? '/driver/dashboard'
          : '/customer-dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  if ((isAdminRoute || isDriverRoute || isCustomerRoute) && !session?.user) {
    const signInUrl = new URL('/sign-in', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (isAdminRoute && role !== 'admin') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isDriverRoute && role !== 'driver') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isCustomerRoute && role === 'driver') {
    return NextResponse.redirect(new URL('/driver/dashboard', request.url))
  }

  if (isCustomerRoute && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/bookings', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/driver/:path*',
    '/customer-dashboard/:path*',
    '/booking/:path*',
    '/sign-in',
    '/sign-up',
  ],
}
