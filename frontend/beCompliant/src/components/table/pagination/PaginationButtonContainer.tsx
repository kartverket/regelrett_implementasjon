import { Flex, Icon } from '@kvib/react';
import { Table, Updater } from '@tanstack/react-table';
import { PaginationActionButton } from './PaginationActionButton';
import { PaginationRelativeButtons } from './PaginationRelativeButtons';
import { useRef, useEffect, useState } from 'react';

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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (ref.current) {
      if (!isInitialLoad) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'auto',
        });
      } else {
        setIsInitialLoad(false);
      }
    }
  }, [index]);

  return (
    <Flex
      marginTop="4"
      ref={ref}
      width="100%"
      gap="1"
      alignItems="center"
      justifyContent="center"
    >
      <PaginationActionButton
        ariaLabel={'Gå til forrige side'}
        isDisplayed={table.getCanPreviousPage()}
        onClick={() => {
          table.previousPage();
        }}
      >
        <Icon size={30} icon="chevron_left" />
      </PaginationActionButton>
      <PaginationActionButton
        onClick={() => {
          table.setPageIndex(0);
        }}
        ariaLabel={'Gå til side 1'}
        isCurrent={index === 0}
      >
        1
      </PaginationActionButton>
      <PaginationRelativeButtons
        numberOfPages={numberOfPages}
        currentIndex={index}
        setIndex={(index: Updater<number>) => {
          table.setPageIndex(index);
        }}
      />

      {numberOfPages > 1 && (
        <PaginationActionButton
          onClick={() => {
            table.setPageIndex(numberOfPages - 1);
          }}
          ariaLabel={'Gå til siste side'}
          isCurrent={index === numberOfPages - 1}
        >
          {numberOfPages}
        </PaginationActionButton>
      )}
      <PaginationActionButton
        onClick={() => {
          table.nextPage();
        }}
        ariaLabel={'Gå til neste side'}
        isDisplayed={table.getCanNextPage()}
      >
        <Icon size={30} icon="chevron_right" />
      </PaginationActionButton>
    </Flex>
  );
}
