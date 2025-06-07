import { atom } from 'jotai';
export interface Name {
  name: string;
}

export type Names = Name[];

export const namesAtom = atom<Names>([]);