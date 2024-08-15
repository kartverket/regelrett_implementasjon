import { Flex, Icon } from '@kvib/react';
import { Table } from '@tanstack/react-table';
import { PagniationActionButton } from './PagniationActionButton';
import { PaginationRelativeButtons } from './PaginationRelativeButtons';
import { useEffect, useRef, useState } from 'react';

interface Props<TData> {
  table: Table<TData>;
}

export function PaginationButtonContainer<TData>({ table }: Props<TData>) {
  const state = table.getState().pagination;
  const index = state.pageIndex;
  const pageSize = state.pageSize;
  const numberOfRows = table.getRowCount();
  const numberOfPages = Math.ceil(numberOfRows / pageSize);
  const ref = useRef<HTMLDivElement>(null);
  const [isFirstRender, setIsFirstRender] = useState<boolean>(false);

  // these 2 useEffects are used to avoid horisontal displacement when
  // jumping between pages in the table
  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }
  }, [isFirstRender]);

  useEffect(() => {
    if (isFirstRender || ref.current === null) return;
    // Scroll to the bottom of the table when the page index changes
    ref.current.scrollIntoView({ behavior: 'auto', block: 'start' });
  }, [isFirstRender, index]);

  return (
    <Flex
      ref={ref}
      w="100%"
      gap="1"
      alignItems="center"
      justifyContent="center"
    >
      <PagniationActionButton
        ariaLabel={'Gå til forrige side'}
        isDisplayed={table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        <Icon size={30} icon="chevron_left" />
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

      {numberOfPages > 1 && (
        <PagniationActionButton
          onClick={() => table.setPageIndex(numberOfPages - 1)}
          ariaLabel={'Gå til siste side'}
          isCurrent={index === numberOfPages - 1}
        >
          {numberOfPages}
        </PagniationActionButton>
      )}
      <PagniationActionButton
        onClick={() => table.nextPage()}
        ariaLabel={'Gå til neste side'}
        isDisplayed={table.getCanNextPage()}
      >
        <Icon size={30} icon="chevron_right" />
      </PagniationActionButton>
    </Flex>
  );
}
