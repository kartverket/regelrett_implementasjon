import { Box, Select, Heading } from "@kvib/react";
import { Dispatch, SetStateAction } from "react";
import { ActiveFilter } from "../table/Table";

interface TableFilterProps {
    filterName: string;
    filterOptions: string[];
    activeFilters: ActiveFilter[];
    setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export const TableFilter = (props: TableFilterProps) => {
    const { filterName, filterOptions, activeFilters, setActiveFilters } = props;

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const filterValue = filterOptions.includes(event.target.value) ? event.target.value : null;

        const updatedFilters = activeFilters.map(filter =>
            filter.filterName === filterName ? { ...filter, filterValue } : filter
        );

        if (!updatedFilters.some(filter => filter.filterName === filterName)) {
            updatedFilters.push({ filterName: filterName, filterValue: filterValue });
        }

        setActiveFilters(updatedFilters);
    };

    return (
        <Box style={{margin: 20, maxWidth: 210}}>
            <Heading style={{marginBottom: 10}} size={"sm"}>{props.filterName}</Heading>
            <Select
                aria-label="select"
                placeholder="Velg alternativ"
                onChange={handleFilterChange}
            >
                {props.filterOptions.map((filterOption, index) => (
                    <option value={filterOption} key={index}>
                        {filterOption}
                    </option>
                ))}
            </Select>
        </Box>
    );
};