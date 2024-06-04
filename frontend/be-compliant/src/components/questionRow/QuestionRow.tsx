import { Dispatch, SetStateAction } from 'react';
import { Td, Tr } from '@kvib/react';
import { Answer } from '../answer/Answer';
import './questionRow.css';
import { formatDateTime } from '../../utils/formatTime';
import { Fields, RecordType } from '../../pages/Table';
import { Field } from '../../hooks/datafetcher';
interface QuestionRowProps {
  record: RecordType;
  choices: string[];
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  tableColumns: Field[];
  team?: string;
}

export const QuestionRow = ({
  record,
  choices,
  setFetchNewAnswers,
  tableColumns,
  team,
}: QuestionRowProps) => {
  const arrayToString = (list: string[]): string => list.join(', ');
  return (
    <Tr>
      <Td>
        {record.fields.answer ? formatDateTime(record.fields.updated) : ''}
      </Td>
      <Td className="finished">{record.fields.status}</Td>

      {tableColumns.map((column: Field, index: number) => {
        const columnKey = column.name as keyof Fields;
        const cellValue = record.fields[columnKey];
        const cellRenderValue = Array.isArray(cellValue)
          ? arrayToString(cellValue)
          : cellValue;

        return <Td key={index}>{cellRenderValue}</Td>;
      })}

      <Td className="answer">
        <Answer
          choices={choices}
          answer={record.fields.answer ? record.fields.answer : ''}
          record={record}
          setFetchNewAnswers={setFetchNewAnswers}
          team={team}
        />
      </Td>
    </Tr>
  );
};
