/**
 * Supabase Client Adapter untuk RongsokSalon
 * Jika environment variable Supabase diisi di Vercel/.env.local,
 * aplikasi dapat langsung melakukan query ke Supabase cloud.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id')
);

// REST API Helper ringan untuk Supabase (tanpa perlu install library besar)
export async function supabaseQuery(endpoint: string, options: RequestInit = {}) {
  if (!isSupabaseConfigured) {
    console.warn('Supabase belum dikonfigurasi, menggunakan penyimpanan lokal.');
    return null;
  }

  const url = `${supabaseUrl}/rest/v1/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Supabase error [${response.status}]:`, errorText);
    throw new Error(`Supabase query error: ${response.statusText}`);
  }

  return response.json();
}
