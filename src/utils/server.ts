import { createClient } from '@supabase/supabase-js';

// Este cliente se usa solo en funciones de servidor o API Routes
export const createServerSupabase = () => {
  return createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
  );
};