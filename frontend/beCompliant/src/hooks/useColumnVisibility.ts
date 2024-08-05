import { FILLMODE_COLUMNS } from '../utils/fillmodeColumns';
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

  const hideColumns = (names: string[]) => {
    names.forEach((name) => {
      if (!FILLMODE_COLUMNS.includes(name)) {
        hideColumn(name);
      }
    });
  };

  const getShownColumns = (
    record: Record<string, boolean>,
    keysToCheck: string[]
  ): string[] =>
    keysToCheck.filter((key) => record[key] === true || !(key in record));

  const showOnlyFillModeColumns = () => {
    Object.keys(columnVisibility).forEach((key) => {
      if (FILLMODE_COLUMNS.includes(key)) {
        hideColumn(key);
      }
    });
  };

  return [
    columnVisibility,
    setColumnVisibility,
    unHideColumn,
    unHideColumns,
    hasHiddenColumns,
    hideColumns,
    showOnlyFillModeColumns,
    getShownColumns,
  ] as const;
}
