import { localStorageAdapter } from './localStorageAdapter.js';
import { supabaseAdapter } from './supabaseAdapter.js';
import { airtableAdapter } from './airtableAdapter.js';

export const isSupabaseEnabled = false;
export const isAirtableEnabled = true;

// Storage priority: Airtable > Supabase > LocalStorage
export const storage = isAirtableEnabled
    ? airtableAdapter
    : (isSupabaseEnabled ? supabaseAdapter : localStorageAdapter);
