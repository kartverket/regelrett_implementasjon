import { Icon, Select, useTheme } from '@kvib/react';
import { Dispatch, SetStateAction } from 'react';
import { Fields } from '../../types/tableTypes';

export type TableSorterProps = {
  fieldSortedBy: keyof Fields;
  setFieldSortedBy: Dispatch<SetStateAction<keyof Fields>>;
};

export const TableSorter = (props: TableSorterProps) => {
  const theme = useTheme();

  const handleSortedData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.setFieldSortedBy(e.target.value as keyof Fields);
  };

  return (
    <Select
      aria-label="select"
      placeholder="Sortér etter"
      onChange={handleSortedData}
      variant="unstyled"
      style={{ color: theme.colors.green[500] }}
      icon={<Icon icon="sort" />}
      iconColor={theme.colors.green[500]}
    >
      <option value="Pri">Prioritet</option>
      <option value="status">Status</option>
      <option value="updated">Sist oppdatert</option>
    </Select>
  );
};
