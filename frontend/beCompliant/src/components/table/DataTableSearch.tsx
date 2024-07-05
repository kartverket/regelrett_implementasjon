import { Table } from '@tanstack/react-table'
import {
  Icon,
  Input,
  InputGroup,
  InputGroupProps,
  InputLeftElement,
} from '@kvib/react'
import React, { useEffect, useState } from 'react'
import { useDebounce } from '../../hooks/useDebounce'

interface Props<TData> extends InputGroupProps {
  table: Table<TData>
}

export function DataTableSearch<TData>({ table, ...rest }: Props<TData>) {
  const globalFilter = table.getState().globalFilter
  const [value, setValue] = useState<string | undefined>(globalFilter)

  const debouncedValue = useDebounce(value, 200)
  useEffect(() => {
    table.setGlobalFilter(debouncedValue)
  }, [debouncedValue])

  return (
    <InputGroup maxW="18rem" {...rest}>
      <InputLeftElement>
        <Icon icon="search" size={24} />
      </InputLeftElement>
      <Input
        value={value ?? ''}
        placeholder="Søk her..."
        aria-label="Søk i tabell"
        type="search"
        onChange={(event) => setValue(event.target.value)}
      />
    </InputGroup>
  )
}
