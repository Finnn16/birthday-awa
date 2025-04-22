import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://mskigcutlpnrngjqayns.supabase.co'
const supabaseKey = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1za2lnY3V0bHBucm5nanFheW5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDc1NjYsImV4cCI6MjA2MDEyMzU2Nn0.EUebIEa0n0J_rtcHDJ0hZS9cUpY7HzjMqd7qLtAxoVw
export const supabase = createClient(supabaseUrl, supabaseKey)