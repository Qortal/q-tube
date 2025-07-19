import { createStore, get, set, del } from 'idb-keyval';

export const store = createStore('jotai-qtube-store', 'settings');
