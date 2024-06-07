import { Dispatch, SetStateAction } from 'react';
import { TableMetaData } from '../hooks/datafetcher';
import { TableFilter, TableFilterProps } from './tableActions/TableFilter';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
} from '@kvib/react';

interface Props {
  tableFilterProps: TableFilterProps;
  tableMetadata: TableMetaData;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  numberOfItems: number;
}

const MobileFilter = ({
  tableFilterProps,
  tableMetadata,
  isOpen,
  setIsOpen,
  numberOfItems,
}: Props) => {
  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps;
  const buttonText =
    activeFilters.length > 0 ? `Vis liste (${numberOfItems} stk)` : 'Vis liste';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="full"
      isFullHeight={true}
    >
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filtrer</DrawerHeader>
        <DrawerBody>
          <Flex direction="column">
            <TableFilter
              filterOptions={filterOptions}
              filterName={'Status'}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />

            {tableMetadata?.fields.map((metaColumn, index) => (
              <TableFilter
                key={index}
                filterName={metaColumn.name}
                filterOptions={metaColumn.options}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            ))}
          </Flex>
        </DrawerBody>
        <DrawerFooter justifyContent="center">
          <Button onClick={() => setIsOpen(false)}>{buttonText}</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilter;
