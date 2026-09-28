import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('YOUR_SUPABASE') &&
  !supabaseUrl.includes('your-project') &&
  !supabaseKey.includes('YOUR_') &&
  !supabaseKey.includes('your-anon')
);

/**
 * Public/Anon Supabase Client.
 * Safe to run in frontend browser.
 * Never uses service_role key.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;
