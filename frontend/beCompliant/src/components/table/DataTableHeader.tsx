import { Button, Icon, TableColumnHeaderProps, Th } from '@kvib/react'
import { Column } from '@tanstack/react-table'

interface Props<TData, TValue> extends TableColumnHeaderProps {
  column: Column<TData, TValue>
  header: string
}

export function DataTableHeader<TData, TValue>({
  column,
  header,
  ...rest
}: Props<TData, TValue>) {
  return (
    <Th key={column.columnDef.id} {...rest}>
      <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
        {header}
        <Icon
          aria-label={
            column.getIsSorted() != false
              ? column.getIsSorted() === 'desc'
                ? 'Sortert synkende'
                : 'Sortert stigende'
              : 'Ikke sortert'
          }
          icon={
            column.getIsSorted() != false
              ? column.getIsSorted() === 'desc'
                ? 'keyboard_arrow_down'
                : 'keyboard_arrow_up'
              : 'unfold_more'
          }
        />
      </Button>
    </Th>
  )
}
