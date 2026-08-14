import { createClient } from '@supabase/supabase-js';

// Supabase client instance for storing telemetry and contact dispatches
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
