import { Icon, Input, InputGroup, InputGroupProps } from '@kvib/react';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface Props<TData> extends InputGroupProps {
  table: Table<TData>;
}

export function DataTableSearch<TData>({
  table,
  ...rest
}: Omit<Props<TData>, 'children'>) {
  const globalFilter = table.getState().globalFilter;
  const [value, setValue] = useState<string | undefined>(globalFilter);

  const debouncedValue = useDebounce(value, 200);
  useEffect(() => {
    table.setGlobalFilter(debouncedValue);
  }, [debouncedValue, table]);

  return (
    <InputGroup
      startElement={<Icon icon="search" size={16} />}
      maxWidth="26rem"
      background="white"
      {...rest}
    >
      <Input
        value={value ?? ''}
        placeholder="Søk i tabellen"
        aria-label="Søk i tabell"
        type="search"
        onChange={(event) => setValue(event.target.value)}
        size="sm"
      />
    </InputGroup>
  );
}
