// import { localStorageAdapter } from './localStorageAdapter.js';
import { supabaseAdapter } from './supabaseAdapter.js';

// Use Supabase for data persistence across domains
// Use Supabase for data persistence across domains
export const storage = supabaseAdapter;
// export const storage = localStorageAdapter;

export const isSupabaseEnabled = false;
