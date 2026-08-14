import { createClient } from '@supabase/supabase-js';

// Default to Sayan's Supabase Project
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://osoczjnrbuhhqpcfcxck.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export async function logTelemetryToSupabase(telemetryData: Record<string, unknown>) {
  try {
    const { data, error } = await supabase
      .from('agv_telemetry')
      .insert([telemetryData]);
    return { data, error };
  } catch (err) {
    console.warn('Supabase telemetry logging:', err);
    return { data: null, error: err };
  }
}
