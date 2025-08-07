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
  const pageNumber = searchParams.get('page');
  const index = pageNumber ? parseInt(pageNumber) - 1 : state.pageIndex;
  const pageSize = state.pageSize;
  const numberOfRows = table.getRowCount();
  const numberOfPages = Math.ceil(numberOfRows / pageSize);
  const ref = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const setPageRequestParam = (page: number) => {
    setSearchParams((current) => {
      if (page === 1) {
        current.delete('page');
      } else {
        current.set('page', page.toString());
      }
      return current;
    });
  };

  useEffect(() => {
    // If page request parameter is set on page load, tell the table what the correct page is
    table.setPageIndex(index);
  }, []);

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
    <div
      ref={ref}
      className="mt-4 w-full flex gap-1 items-center justify-center"
    >
      <PaginationActionButton
        ariaLabel={'Gå til forrige side'}
        isDisplayed={table.getCanPreviousPage()}
        onClick={() => {
          setPageRequestParam(index);
          table.previousPage();
        }}
      >
        <ChevronLeft className="size-6" />
      </PaginationActionButton>
      <PaginationActionButton
        onClick={() => {
          setPageRequestParam(1);
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
          setPageRequestParam(+index + 1);
          table.setPageIndex(index);
        }}
      />

      {numberOfPages > 1 && (
        <PaginationActionButton
          onClick={() => {
            setPageRequestParam(numberOfPages);
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
          setPageRequestParam(index + 2);
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
