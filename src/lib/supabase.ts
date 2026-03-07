import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;
let offlineMode = false;

function initSupabase(): { client: SupabaseClient | null; isOffline: boolean } {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    // Check if both values exist and are valid
    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      supabaseUrl === 'undefined' ||
      supabaseAnonKey === 'undefined' ||
      supabaseUrl.trim() === '' ||
      supabaseAnonKey.trim() === '' ||
      supabaseUrl === 'your_supabase_url_here' ||
      supabaseAnonKey === 'your_supabase_anon_key_here'
    ) {
      console.warn('[NutriLens] Supabase non configuré — mode hors-ligne activé');
      return { client: null, isOffline: true };
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

    console.info('[NutriLens] Supabase connecté avec succès');
    return { client, isOffline: false };
  } catch (error) {
    console.error('[NutriLens] Erreur initialisation Supabase:', error);
    return { client: null, isOffline: true };
  }
}

const { client, isOffline } = initSupabase();
supabaseInstance = client;
offlineMode = isOffline;

/**
 * Returns the Supabase client or null if in offline mode.
 * ALWAYS check for null before using!
 */
export const supabase = supabaseInstance;

/**
 * Whether the app is running without a database connection.
 * When true, all data is stored locally via Zustand.
 */
export const isOfflineMode = offlineMode;

/**
 * Safe wrapper for Supabase operations.
 * Returns null if offline, otherwise executes the callback.
 */
export async function withSupabase<T>(
  callback: (client: SupabaseClient) => Promise<T>
): Promise<T | null> {
  if (!supabaseInstance || offlineMode) {
    return null;
  }
  try {
    return await callback(supabaseInstance);
  } catch (error) {
    console.error('[NutriLens] Erreur Supabase:', error);
    return null;
  }
}
