import { Select, Spinner } from '@kvib/react';
import { Table } from '../../api/types';

export type TablePickerProps = {
  tables: Table[];
  activeTableId?: string;
  setActiveTableId: (tableId: string) => void;
};

export const TablePicker = ({
  tables,
  activeTableId,
  setActiveTableId,
}: TablePickerProps) => {
  if (!activeTableId) {
    return <Spinner />;
  }

  return (
    <Select
      aria-label="select"
      onChange={(e) => setActiveTableId(e.target.value)}
      value={activeTableId}
      background="white"
      width="210px"
      maxWidth="210px"
      textOverflow="ellipsis"
      whiteSpace="nowrap"
    >
      {tables?.map((table) => (
        <option value={table.id} key={table.id}>
          {table.name}
        </option>
      ))}
    </Select>
  );
};
