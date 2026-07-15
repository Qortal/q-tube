import { atom } from 'jotai';

export interface CopyPreferenceItem {
  key: 'link' | 'title' | 'description';
  checked: boolean;
}

// Default order: Link, Title, Description
const defaultPreferences: CopyPreferenceItem[] = [
  { key: 'link', checked: true },
  { key: 'title', checked: false },
  { key: 'description', checked: false },
];

const STORAGE_KEY = 'copyPreferences';

// Old format: { link: boolean, title: boolean, description: boolean }
// New format: CopyPreferenceItem[]
function migratePreferences(value: unknown): CopyPreferenceItem[] {
  // If it's already an array, return it
  if (Array.isArray(value)) {
    return value;
  }

  // If it's the old object format, convert to array
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const oldPrefs = value as Record<string, boolean>;
    return [
      { key: 'link', checked: oldPrefs.link ?? true },
      { key: 'title', checked: oldPrefs.title ?? false },
      { key: 'description', checked: oldPrefs.description ?? false },
    ];
  }

  // Fallback to default
  return defaultPreferences;
}

// Load from localStorage with migration
function loadFromStorage(): CopyPreferenceItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return migratePreferences(parsed);
    }
  } catch {
    // Ignore errors
  }
  return defaultPreferences;
}

// Base atom initialized from localStorage
const basePreferencesAtom = atom<CopyPreferenceItem[]>(loadFromStorage());

// Derived atom that persists changes to localStorage
// Handles both direct values and function updates
export const copyPreferencesAtom = atom<CopyPreferenceItem[], [CopyPreferenceItem[] | ((prev: CopyPreferenceItem[]) => CopyPreferenceItem[])], void>(
  (get) => get(basePreferencesAtom),
  (get, set, update) => {
    const prev = get(basePreferencesAtom);
    const newValue = typeof update === 'function' 
      ? (update as (prev: CopyPreferenceItem[]) => CopyPreferenceItem[])(prev)
      : update;
    set(basePreferencesAtom, newValue);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newValue));
    } catch {
      // Ignore storage errors
    }
  }
);