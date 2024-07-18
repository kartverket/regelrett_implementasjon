import { Dispatch, SetStateAction } from 'react';
import { Filter, Filters } from './tableActions/TableFilter';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Flex,
  Text,
} from '@kvib/react';
import { TableMetaData } from '../types/tableTypes';

interface Props {
  tableFilterProps: Filters;
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
  const hasActiveFilters = activeFilters.length > 0;
  const buttonText = hasActiveFilters
    ? `Vis liste (${numberOfItems} stk)`
    : 'Vis liste';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      size="full"
      isFullHeight={true}
    >
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Filtrér</DrawerHeader>
        <DrawerBody>
          <Flex alignItems="center">
            <Text as="b">Velg hva du vil se</Text>
            {hasActiveFilters && (
              <Button
                variant="tertiary"
                colorScheme="red"
                style={{ height: 'fit-content', marginLeft: 'auto' }}
                onClick={() => setActiveFilters([])}
              >
                Slett alle
              </Button>
            )}
          </Flex>
          <Flex direction="column">
            <Filter
              filterOptions={filterOptions}
              filterName={'Status'}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />

            {tableMetadata?.fields.map((metaColumn, index) => (
              <Filter
                key={metaColumn.name}
                filterName={metaColumn.name}
                filterOptions={metaColumn.options}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            ))}
          </Flex>
        </DrawerBody>
        <DrawerFooter justifyContent="center">
          <Button onClick={() => setIsOpen(false)} size="lg">
            {buttonText}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileFilter;
