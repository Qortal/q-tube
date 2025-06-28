import { atom } from 'jotai';

type SuperLikes = any[];

export const superlikesAtom = atom<SuperLikes>([]);
