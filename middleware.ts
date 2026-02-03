import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/lesen',
  '/suche',
]

// Auth routes - redirect logged-in users away from these
const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/reset-password',
]

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const path = request.nextUrl.pathname

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route =>
    route === '/' ? path === '/' : path.startsWith(route)
  )

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Redirect to login if not authenticated and trying to access protected route
  if (!user && !isPublicRoute && !isAuthRoute && !path.startsWith('/auth/callback')) {
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect logged-in users away from auth pages (login, register, etc.)
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json (PWA manifest)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
