import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a minimal client if credentials aren't configured
  if (!url || !key || url === 'undefined' || key === 'undefined') {
    throw new Error('Supabase credentials not configured');
  }

  return createBrowserClient<Database>(url, key)
}
