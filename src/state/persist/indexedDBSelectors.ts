import { get, set, del } from 'idb-keyval';
import { store } from './jotaiIndexedDB';

export const jotaiIndexedDBStorage = {
  getItem: async <T>(key: string): Promise<T | null> => {
    return (await get(key, store)) ?? null;
  },
  setItem: async <T>(key: string, value: T): Promise<void> => {
    await set(key, value, store);
  },
  removeItem: async (key: string): Promise<void> => {
    await del(key, store);
  },
};
