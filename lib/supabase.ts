import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pjogpeeojnlofzivqxqc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqb2dwZWVvam5sb2Z6aXZxeHFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDU5MDMsImV4cCI6MjA3MzU4MTkwM30.uxxa-6Po37k01pSVAO1_VATsOqKPlFeBIErUDCJJoNI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)