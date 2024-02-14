import { atom, useAtom } from 'jotai';

const gridCompactViewAtom = atom(false);

export function useGridSwitcher() {
  const [isGridCompact, setIsGridCompact] = useAtom(gridCompactViewAtom);
  return {
    isGridCompact,
    setIsGridCompact,
  };
}
