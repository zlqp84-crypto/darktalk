import { supabase } from '@/lib/supabase';

// Called after authentication; the RPC only creates a missing profile for the
// confirmed caller and never overwrites existing profile or privilege fields.
export async function ensureProfile(): Promise<boolean> {
  const { error } = await supabase.rpc('ensure_my_profile');
  return !error;
}
