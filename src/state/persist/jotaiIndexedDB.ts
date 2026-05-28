import { createStore } from 'idb-keyval';

export const store = createStore('jotai-qtube-store', 'settings');
