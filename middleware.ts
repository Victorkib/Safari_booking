import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

const adminRoutes = ['/admin']
const driverRoutes = ['/driver']
const authRoutes = ['/sign-in', '/sign-up']
const protectedRoutes = ['/customer-dashboard', '/booking']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r))
  const isDriverRoute = driverRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname.startsWith(r))
  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r))

  if (!isAdminRoute && !isDriverRoute && !isAuthRoute && !isProtectedRoute) {
    return NextResponse.next()
  }

  const session = await auth.api.getSession({ headers: request.headers })
  const role = (session?.user as { role?: string } | undefined)?.role ?? 'customer'

  if (isAuthRoute && session?.user) {
    const redirectTo =
      role === 'admin'
        ? '/admin/dashboard'
        : role === 'driver'
          ? '/driver/dashboard'
          : '/customer-dashboard'
    return NextResponse.redirect(new URL(redirectTo, request.url))
  }

  if ((isAdminRoute || isDriverRoute || isProtectedRoute) && !session?.user) {
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
