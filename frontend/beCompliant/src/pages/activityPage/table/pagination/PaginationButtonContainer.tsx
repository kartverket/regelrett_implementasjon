import { Table, Updater } from '@tanstack/react-table';
import { PaginationActionButton } from './PaginationActionButton';
import { PaginationRelativeButtons } from './PaginationRelativeButtons';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router';

interface Props<TData> {
  table: Table<TData>;
}

export function PaginationButtonContainer<TData>({ table }: Props<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = table.getState().pagination;
  const searchParamPage = searchParams.get('page');
  const index = searchParamPage
    ? parseInt(searchParamPage) - 1
    : state.pageIndex;
  const pageSize = state.pageSize;
  const numberOfRows = table.getRowCount();
  const numberOfPages = Math.ceil(numberOfRows / pageSize);
  const ref = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handlePageChange = (page: string) => {
    setSearchParams((current) => {
      const newParams = new URLSearchParams(current);
      if (page === '1') {
        newParams.delete('page');
      } else {
        newParams.set('page', page);
      }
      return newParams;
    });
  };

  useEffect(() => {
    table.setPageIndex(index);
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
    <div
      ref={ref}
      className="mt-4 w-full flex gap-1 items-center justify-center"
    >
      <PaginationActionButton
        ariaLabel={'Gå til forrige side'}
        isDisplayed={table.getCanPreviousPage()}
        onClick={() => {
          handlePageChange(index.toString());
          table.previousPage();
        }}
      >
        <ChevronLeft className="size-6" />
      </PaginationActionButton>
      <PaginationActionButton
        onClick={() => {
          handlePageChange('1');
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
        setIndex={(bindex: Updater<number>) => {
          handlePageChange((+bindex + 1).toString());
          table.setPageIndex(bindex);
        }}
        handlePageChange={handlePageChange}
      />

      {numberOfPages > 1 && (
        <PaginationActionButton
          onClick={() => {
            handlePageChange(numberOfPages.toString());
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
          handlePageChange((index + 2).toString());
          table.nextPage();
        }}
        ariaLabel={'Gå til neste side'}
        isDisplayed={table.getCanNextPage()}
      >
        <ChevronRight className="size-6" />
      </PaginationActionButton>
    </div>
  );
}
