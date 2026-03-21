import { supabase } from './supabase';

export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const protectRoute = async (router: any) => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    router.replace('/auth/login');
  }
};