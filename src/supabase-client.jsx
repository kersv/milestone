
import { createClient } from '@supabase/supabase-js'

// Vite requires environment variables to be prefixed with VITE_
// and accessed via import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// A guard clause to ensure your app doesn't deploy without the required keys.
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey)