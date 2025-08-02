// usePersistAtom.ts
import { atom, useAtom, useAtomValue, WritableAtom } from 'jotai';
import { useMemo } from 'react';
import { useAuth } from 'qapp-core';
import { getDefaultStore } from 'jotai';
import { jotaiIndexedDBStorage } from './indexedDBSelectors';

const atomCache = new Map<string, WritableAtom<any, [any], any>>();
const hydrationStatusCache = new Map<
  string,
  WritableAtom<boolean, [boolean], void>
>();

export function usePersistAtom<T>(key: string, initialValue: T) {
  const { address: authAddress } = useAuth();
  const address = authAddress || 'anonymous';
  const scopedKey = `${address}/${key}`;

  return useMemo(() => {
    if (atomCache.has(scopedKey)) return atomCache.get(scopedKey)!;

    const baseAtom = atom<T>(initialValue);
    const hydrationAtom = atom<boolean, [boolean], void>(
      false,
      (_get, set, hydrated) => set(hydrationAtom, hydrated)
    );

    jotaiIndexedDBStorage.getItem<T>(scopedKey).then((stored) => {
      if (stored !== null) {
        getDefaultStore().set(baseAtom, stored);
      }
      const atomToSet = hydrationStatusCache.get(scopedKey);
      if (atomToSet) {
        getDefaultStore().set(atomToSet, true);
      }
    });

    const derivedAtom = atom<T, [T | ((prev: T) => T)], Promise<void>>(
      (get) => get(baseAtom),
      async (get, set, update) => {
        const prev = get(baseAtom);
        const next =
          typeof update === 'function'
            ? (update as (prev: T) => T)(prev)
            : update;
        set(baseAtom, next);
        await jotaiIndexedDBStorage.setItem(scopedKey, next);
      }
    );

    atomCache.set(scopedKey, derivedAtom);
    hydrationStatusCache.set(scopedKey, hydrationAtom);

    return derivedAtom;
  }, [scopedKey]);
}

export function useHydrationAtom(key: string) {
  const { address: authAddress } = useAuth();
  const address = authAddress || 'anonymous';
  const scopedKey = `${address}/${key}`;

  return useMemo(() => {
    if (!hydrationStatusCache.has(scopedKey)) {
      const hydrationAtom = atom<boolean, [boolean], void>(
        false,
        (_get, set, hydrated) => set(hydrationAtom, hydrated)
      );
      hydrationStatusCache.set(scopedKey, hydrationAtom);
    }
    return hydrationStatusCache.get(scopedKey)!;
  }, [scopedKey]);
}

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const atom = usePersistAtom<T>(key, initialValue);
  const hydratedAtom = useHydrationAtom(key);
  const [value, setValue] = useAtom(atom);
  const isHydrated = useAtomValue(hydratedAtom);

  return [value, setValue, isHydrated];
}
// export function usePersistedState<T>(key: string, initialValue: T) {
//   const atom = usePersistAtom<T>(key, initialValue);
//   return useAtom(atom);
// }
