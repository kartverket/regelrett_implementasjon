import { Box, Select, Heading } from "@kvib/react";

interface TableFilterProps {
    filterName: string,
    filterOptions: string[]
}

export const TableFilter = (props: TableFilterProps) => {
    return (
        <Box style={{margin: 20, maxWidth: 210}}>
            <Heading style={{marginBottom: 10}} size={"sm"}>{props.filterName}</Heading>
            <Select
                aria-label="select"
                placeholder="Velg alternativ"
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