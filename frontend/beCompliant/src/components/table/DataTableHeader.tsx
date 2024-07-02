import {TableColumnHeaderProps, Th} from "@kvib/react";
import {Column} from "@tanstack/react-table";

interface Props<TData, TValue> extends TableColumnHeaderProps {
    column: Column<TData, TValue>
    header: string
}


export function DataTableHeader<TData, TValue>({column, header, ...rest}: Props<TData, TValue>) {
    return (<Th key={column.columnDef.id} {...rest}>{header}</Th>)
}