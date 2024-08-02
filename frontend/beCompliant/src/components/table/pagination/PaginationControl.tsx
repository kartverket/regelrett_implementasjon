import { Flex, IconButton } from '@kvib/react';
import { Table } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
  content?: string;
}

export function PaginationControl<TData>({ table }: Props<TData>) {
  return (
    <Flex flexDirection="column" gap="1" alignItems="center">
      <IconButton
        aria-label={'Gå til forrige side'}
        icon={'arrow_left'}
        size={'lg'}
        isDisabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      />
      <IconButton
        aria-label={'Gå til side 1'}
        icon={'1'}
        size={'lg'}
        variant={}
        onClick={() => table.setPageIndex(0)}
      />
      {/* middle buttons*/}
      <IconButton
        aria-label={'Gå til siste side'}
        icon={numberOfPages}
        size={'lg'}
        onClick={() => table.setPageIndex(numberOfPages - 1)}
      />
      <IconButton
        aria-label={'Gå til neste side'}
        icon={'arrow_right'}
        size={'lg'}
        variant={}
        onClick={() => table.setPageIndex(0)}
      />
    </Flex>
  );
}
