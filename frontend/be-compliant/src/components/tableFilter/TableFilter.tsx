import { Box, Select, Heading } from "@kvib/react";
import { Dispatch, SetStateAction } from "react";
import { ActiveFilter } from "../table/Table";
import { Choice } from "../../hooks/datafetcher";

interface TableFilterProps {
    filterName: string;
    filterOptions: Choice[];
    activeFilters: ActiveFilter[];
    setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
}

export const TableFilter = (props: TableFilterProps) => {
    const { filterName, filterOptions, activeFilters, setActiveFilters } = props;

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const filterValue = filterOptions.find((option) => option.name === event.target.value);

        const updatedFilters = activeFilters.filter(filter => filter.filterName !== filterName);

        if (filterValue) {
            updatedFilters.push({ filterName: filterName, filterValue: filterValue.name });
        }

        setActiveFilters(updatedFilters);
    };

    return (
        <Box style={{margin: 20, maxWidth: 210}}>
            <Heading style={{marginBottom: 10}} size={"sm"}>{props.filterName}</Heading>
            <Select
                aria-label="select"
                placeholder="Alle"
                onChange={handleFilterChange}
            >
                {props.filterOptions.map((filterOption, index) => (
                    <option value={filterOption.name} key={index}>
                        {filterOption.name}
                    </option>
                ))}
            </Select>
        </Box>
    );
};