import { localStorageAdapter } from './localStorageAdapter.js';
import { supabaseAdapter } from './supabaseAdapter.js';

// Use Supabase for data persistence across domains
export const storage = supabaseAdapter;

export const isSupabaseEnabled = true;
