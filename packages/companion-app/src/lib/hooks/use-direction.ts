import { useEffect } from 'react';

export function useDirection(layout: string) {
  useEffect(() => {
    document.documentElement.dir = layout;
  }, [layout]);
}
