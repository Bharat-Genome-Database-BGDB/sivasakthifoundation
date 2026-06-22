import { createClient } from '@supabase/supabase-js'

// These environment variables will be needed in your .env.local file later.
// For now, we use placeholders so the build doesn't crash.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)