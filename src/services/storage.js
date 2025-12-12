import { localStorageAdapter } from './localStorageAdapter.js';
import { googleSheetsAdapter } from './googleSheetsAdapter.js';

export const isGoogleSheetsEnabled = true;

// Storage priority: Google Sheets > LocalStorage
export const storage = isGoogleSheetsEnabled
    ? googleSheetsAdapter
    : localStorageAdapter;
