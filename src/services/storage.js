import { localStorageAdapter } from './localStorageAdapter.js';
import { supabaseAdapter } from './supabaseAdapter.js';
import { airtableAdapter } from './airtableAdapter.js';
import { googleSheetsAdapter } from './googleSheetsAdapter.js';

export const isSupabaseEnabled = false;
export const isAirtableEnabled = false;
export const isGoogleSheetsEnabled = true;

// Storage priority: Google Sheets > Airtable > Supabase > LocalStorage
export const storage = isGoogleSheetsEnabled
    ? googleSheetsAdapter
    : (isAirtableEnabled
        ? airtableAdapter
        : (isSupabaseEnabled ? supabaseAdapter : localStorageAdapter));

