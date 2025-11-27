import { useState, useEffect, useCallback } from 'react';

export function useSelection(keys = []) {
  const [selected, setSelected] = useState(new Set());

  useEffect(() => {
    setSelected(new Set());
  }, [keys]);

  const handleDeselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleDeselectOne = useCallback((key) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.delete(key);
      return copy;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelected(new Set(keys));
  }, [keys]);

  const handleSelectOne = useCallback((key) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.add(key);
      return copy;
    });
  }, []);

  const selectedAny = selected.size > 0;
  const selectedAll = selected.size === keys.length;

  return {
    deselectAll: handleDeselectAll,
    deselectOne: handleDeselectOne,
    selectAll: handleSelectAll,
    selectOne: handleSelectOne,
    selected,
    selectedAny,
    selectedAll,
  };
}
