import {createClient} from '@supabase/supabase-js';

export function imagesEnabled() {
  return process.env.SERVER_IMAGE_UPLOAD_ENABLED === 'true' && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
export function serverImageKeyHasValidFormat() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? '';
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(key) || /^sb_secret_[A-Za-z0-9_-]+$/.test(key);
}
export function imageClients(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const options = {auth: {persistSession: false, autoRefreshToken: false, detectSessionInUrl: false}};
  return {
    user: createClient(url, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {...options, global: {headers: {Authorization: `Bearer ${token}`}}}),
    service: createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY!.trim(), options),
  };
}
