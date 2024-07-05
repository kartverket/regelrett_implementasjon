import { Dispatch, SetStateAction } from 'react'
import { TableMetaData } from '../hooks/datafetcher'
import { TableFilter, TableFilterProps } from './tableActions/TableFilter'
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
} from '@kvib/react'

interface Props {
  tableFilterProps: TableFilterProps
  tableMetadata: TableMetaData
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  numberOfItems: number
}

const MobileFilter = ({
  tableFilterProps,
  tableMetadata,
  isOpen,
  setIsOpen,
  numberOfItems,
}: Props) => {
  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps
  const hasActiveFilters = activeFilters.length > 0
  const buttonText = hasActiveFilters
    ? `Vis liste (${numberOfItems} stk)`
    : 'Vis liste'

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
            <TableFilter
              filterOptions={filterOptions}
              filterName={'Status'}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />

            {tableMetadata?.fields.map((metaColumn, index) => (
              <TableFilter
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
  )
}

export default MobileFilter
