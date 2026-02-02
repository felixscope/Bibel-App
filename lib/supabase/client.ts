import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton instance to prevent multiple clients causing lock conflicts
let supabaseClient: SupabaseClient<Database> | null = null;

export function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Return a minimal client if credentials aren't configured
  if (!url || !key || url === 'undefined' || key === 'undefined') {
    throw new Error('Supabase credentials not configured');
  }

  supabaseClient = createBrowserClient<Database>(url, key);
  return supabaseClient;
}
