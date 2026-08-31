import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'

// Edge middleware runs on every request, so a slow or unreachable Supabase
// must never be allowed to consume the whole invocation budget.
const AUTH_TIMEOUT_MS = 2000

function hasAuthCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some(({ name }) => name.startsWith('sb-') && name.includes('auth-token'))
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Without an auth cookie there is no session to refresh, so skip the
  // network round-trip entirely — anonymous traffic never touches Supabase.
  if (!hasAuthCookie(request)) {
    return { supabaseResponse, user: null }
  }

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
      global: {
        fetch: (input, init) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(AUTH_TIMEOUT_MS) }),
      },
    }
  )

  // A hanging request never throws, so the timeout above is what turns a
  // Supabase outage into a catchable error instead of a middleware timeout.
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // If the auth check fails or times out, treat as unauthenticated.
    // Public routes still work; protected routes redirect to login.
  }

  return { supabaseResponse, user }
}
