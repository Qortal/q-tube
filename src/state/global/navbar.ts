import { atom } from 'jotai';
import { RefObject } from 'react';

export const isSideBarExpandedAtom = atom(false);

export const scrollRefAtom = atom<RefObject<HTMLElement> | null>(null);
