import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwffvmzxeyhftjtvkpmw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZmZ2bXp4ZXloZnRqdHZrcG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjYyMTUsImV4cCI6MjA3OTQwMjIxNX0.uy-BDEiyaOortHwRXuPBM7RTxrfDmz7g0xQvWIMG_io';

export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : null;
