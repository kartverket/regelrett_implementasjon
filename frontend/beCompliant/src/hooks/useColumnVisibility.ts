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

  const unHideColumns = () => {
    Object.keys(columnVisibility).forEach((key) => {
      unHideColumn(key);
    });
  };

  return [
    columnVisibility,
    setColumnVisibility,
    unHideColumn,
    unHideColumns,
    hasHiddenColumns,
  ] as const;
}
