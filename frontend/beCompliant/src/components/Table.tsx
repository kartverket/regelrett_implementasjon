import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@kvib/react';
import { Choice, Field } from '../hooks/datafetcher';
import { RecordType } from '../pages/TablePage';
import { QuestionRow } from './questionRow/QuestionRow';

type TableComponentProps = {
  data: RecordType[];
  fields: Field[];
  team?: string;
  choices: Choice[];
};

export function TableComponent({
  data,
  fields,
  choices,
  team,
}: TableComponentProps) {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Når</Th>
            {fields.map((field) => (
              <Th key={field.id}>{field.name}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: RecordType) => (
            <QuestionRow
              key={item.fields.ID}
              record={item}
              choices={choices}
              tableColumns={fields}
              team={team}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
