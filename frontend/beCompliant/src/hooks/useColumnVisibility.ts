import { FILLMODE_COLUMN_IDXS } from '../utils/fillmodeColumns';
import { useLocalstorageState } from './useLocalstorageState';

export function useColumnVisibility() {
  const [columnVisibility, setColumnVisibility] = useLocalstorageState<
    Record<string, boolean>
  >('columnVisibility', {});

  const hasHiddenColumns = Object.values(columnVisibility).some(
    (value) => value === false
  );

  const unHideColumn = (name: string) => {
    setColumnVisibility((prev: Record<string, boolean>) => ({
      ...prev,
      [name]: true,
    }));
  };

  const hideColumn = (name: string) => {
    setColumnVisibility((prev: Record<string, boolean>) => ({
      ...prev,
      [name]: false,
    }));
  };

  const unHideColumns = () => {
    Object.keys(columnVisibility).forEach((key) => {
      unHideColumn(key);
    });
  };

  const showOnlyFillModeColumns = (names: string[]) => {
    names.forEach((name, idx) => {
      if (!FILLMODE_COLUMN_IDXS.includes(idx)) {
        hideColumn(name);
      }
    });
  };

  const getShownColumns = (
    record: Record<string, boolean>,
    keysToCheck: string[]
  ): string[] =>
    keysToCheck.filter((key) => record[key] === true || !(key in record));

  return [
    columnVisibility,
    setColumnVisibility,
    unHideColumn,
    unHideColumns,
    hasHiddenColumns,
    showOnlyFillModeColumns,
    getShownColumns,
  ] as const;
}
