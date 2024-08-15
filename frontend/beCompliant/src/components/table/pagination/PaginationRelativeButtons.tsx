import { Updater } from '@tanstack/react-table';
import React from 'react';
import { PagniationActionButton } from './PagniationActionButton';
import { Center, Flex, Icon } from '@kvib/react';

interface Props {
  numberOfPages: number;
  currentIndex: number;
  setIndex: (updater: Updater<number>) => void;
}

export function PaginationRelativeButtons({
  numberOfPages,
  currentIndex,
  setIndex,
}: Props) {
  // If less then 7 total pages display all pages without ...
  if (numberOfPages < 7) {
    return [...Array(numberOfPages - 2)].map((_, index) => {
      return (
        <PagniationActionButton
          ariaLabel={`Gå til side ${index + 2}`}
          onClick={() => setIndex(index + 1)}
          isCurrent={currentIndex === index + 1}
          key={index}
        >
          {index + 2}
        </PagniationActionButton>
      );
    });
  }

  // if the currently displayed page is in the lower section
  if (currentIndex < 4) {
    return [...Array(5)].map((_, index) => {
      if (index === 4) {
        return (
          <Center boxSize="12">
            <Icon icon="more_horiz" key={index} />
          </Center>
        );
      }
      return (
        <PagniationActionButton
          key={index}
          ariaLabel={`Gå til side ${index + 2}`}
          onClick={() => setIndex(index + 1)}
          isCurrent={currentIndex === index + 1}
        >
          {index + 2}
        </PagniationActionButton>
      );
    });
  }

  // if the currently displayed page is in the upper section
  if (numberOfPages - currentIndex < 4) {
    return [...Array(5)]
      .map((_, index) => {
        const buttonIndex = numberOfPages - index - 2;
        if (index === 4) {
          return (
            <Center boxSize="12">
              <Icon icon="more_horiz" key={index} />
            </Center>
          );
        }
        return (
          <PagniationActionButton
            key={index}
            ariaLabel={`Gå til side ${index + 2}`}
            onClick={() => setIndex(buttonIndex)}
            isCurrent={currentIndex === buttonIndex}
          >
            {buttonIndex + 1}
          </PagniationActionButton>
        );
      })
      .reverse();
  }

  // if the currently displayed page is in the middle section
  return [...Array(5)].map((_, index) => {
    const buttonIndex = currentIndex + index - 2;
    if (index === 0 || index === 4) {
      return (
        <Center boxSize="12">
          <Icon icon="more_horiz" key={index} />
        </Center>
      );
    }
    return (
      <PagniationActionButton
        key={index}
        ariaLabel={`Gå til side ${buttonIndex}`}
        onClick={() => setIndex(buttonIndex)}
        isCurrent={index === 2}
      >
        {buttonIndex + 1}
      </PagniationActionButton>
    );
  });
}
