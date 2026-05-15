// ============================================
// FILE: src/config/supabase.js
// PURPOSE: Supabase client initialization
// Replaces: src/config/firebase.js
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper to get public school-assets URLs
export const assetUrl = (filename, v) =>
  `${supabaseUrl}/storage/v1/object/public/school-assets/${filename}${v ? `?v=${v}` : ''}`;

export default supabase;