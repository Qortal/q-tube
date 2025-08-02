import { atom } from 'jotai';

type SuperLikes = any[];

interface Superlike {
  identifier: string;
  [key: string]: any; // You can define more fields as needed
}

// Atom to hold the hashMapSuperlikes
export const hashMapSuperlikesAtom = atom<Record<string, Superlike>>({});

// Write-only atom to add a superlike
export const addToHashMapSuperlikesAtom = atom(
  null,
  (get, set, superlike: Superlike) => {
    const prev = get(hashMapSuperlikesAtom);
    set(hashMapSuperlikesAtom, {
      ...prev,
      [superlike.identifier]: superlike,
    });
  }
);

export const superlikesAtom = atom<SuperLikes>([]);
