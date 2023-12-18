import { atom, useAtom } from 'jotai';
import { LAYOUT_OPTIONS } from '@/lib/constants';

// 1. set initial atom for criptic layout
const cripticLayoutAtom = atom(
  typeof window !== 'undefined'
    ? localStorage.getItem('criptic-layout')
    : LAYOUT_OPTIONS.MODERN
);

const cripticLayoutAtomWithPersistence = atom(
  (get) => get(cripticLayoutAtom),
  (get, set, newStorage: any) => {
    set(cripticLayoutAtom, newStorage);
    localStorage.setItem('criptic-layout', newStorage);
  }
);

// 2. useLayout hook to check which layout is available
export function useLayout() {
  const [layout, setLayout] = useAtom(cripticLayoutAtomWithPersistence);
  return {
    layout,
    setLayout,
  };
}
