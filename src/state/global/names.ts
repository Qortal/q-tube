import { atom } from 'jotai';
export interface Name {
  name: string;
}

export type Names = Name[];

export const namesAtom = atom<Names>([]);

export const followListAtom = atom<string[]>([]);
export const hasFetchFollowListAtom = atom<null | true | false>(null);
