import { Flex, Icon } from '@kvib/react';
import { Table } from '@tanstack/react-table';
import { PagniationActionButton } from './PagniationActionButton';
import { PaginationRelativeButtons } from './PaginationRelativeButtons';

interface Props<TData> {
  table: Table<TData>;
}

export function PaginationButtonContainer<TData>({ table }: Props<TData>) {
  const state = table.getState().pagination;
  const index = state.pageIndex;
  const pageSize = state.pageSize;
  const numberOfRows = table.getRowCount();
  const numberOfPages = Math.ceil(numberOfRows / pageSize);

  return (
    <Flex w="100%" gap="1" alignItems="center" justifyContent="center">
      <PagniationActionButton
        ariaLabel={'Gå til forrige side'}
        isDisabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <Icon icon="arrow_left" />
      </PagniationActionButton>
      <PagniationActionButton
        onClick={() => table.setPageIndex(0)}
        ariaLabel={'Gå til side 1'}
        isCurrent={index === 0}
      >
        1
      </PagniationActionButton>
      <PaginationRelativeButtons
        numberOfPages={numberOfPages}
        currentIndex={index}
        setIndex={table.setPageIndex}
      />

      <PagniationActionButton
        onClick={() => table.setPageIndex(numberOfPages - 1)}
        ariaLabel={'Gå til siste side'}
        isCurrent={index === numberOfPages - 1}
      >
        {numberOfPages}
      </PagniationActionButton>
      <PagniationActionButton
        onClick={() => table.nextPage()}
        ariaLabel={'Gå til neste side'}
        isDisabled={!table.getCanNextPage()}
      >
        <Icon icon="arrow_right" />
      </PagniationActionButton>
    </Flex>
  );
}
