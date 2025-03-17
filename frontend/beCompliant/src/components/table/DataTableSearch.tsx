import {
  Icon,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
} from '@kvib/react';
import { Table } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

interface Props<TData> extends InputGroupProps {
  table: Table<TData>;
}

export function DataTableSearch<TData>({ table, ...rest }: Props<TData>) {
  const globalFilter = table.getState().globalFilter;
  const [value, setValue] = useState<string | undefined>(globalFilter);

  const debouncedValue = useDebounce(value, 200);
  useEffect(() => {
    table.setGlobalFilter(debouncedValue);
  }, [debouncedValue]);

  return (
    <InputGroup maxWidth="26rem" background="white" {...rest}>
      <InputLeftElement margin={-1}>
        <Icon icon="search" size={16} />
      </InputLeftElement>
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
