import { createClient } from '@supabase/supabase-js';

// Sayan's Live Supabase Endpoint & Public Key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://osoczjnrbuhhqpcfcxck.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zb2N6am5yYnVoaHFwY2ZjeGNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODI1NDksImV4cCI6MjEwMjI1ODU0OX0.X7o9czhK_dHxDBE-hlBTJqLdeejn2a0dHp7e7rbkSwU';

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
