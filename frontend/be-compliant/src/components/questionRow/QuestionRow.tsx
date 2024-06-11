import { Dispatch, SetStateAction } from 'react';
import { Td, Tr } from '@kvib/react';
import { Answer } from '../answer/Answer';
import './questionRow.css';
import { formatDateTime } from '../../utils/formatTime';
import { Fields, RecordType } from '../../pages/Table';
import { Field } from '../../hooks/datafetcher';
import Priority from '../Priority';
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
      <Td>{record.fields.Svar ? formatDateTime(record.fields.updated) : ''}</Td>
      <Td className="finished">{record.fields.Status}</Td>

      {tableColumns.map((column: Field, index: number) => {
        const columnKey = column.name as keyof Fields;
        if (columnKey === 'Svar') {
          return (
            <Td className="answer" key={index}>
              <Answer
                choices={choices}
                answer={record.fields.Svar ? record.fields.Svar : ''}
                record={record}
                setFetchNewAnswers={setFetchNewAnswers}
                team={team}
              />
            </Td>
          );
        }
        const cellValue = record.fields[columnKey];
        const cellRenderValue = Array.isArray(cellValue)
          ? arrayToString(cellValue)
          : cellValue;
        if (columnKey === 'Pri' && typeof cellRenderValue === 'string') {
          return (
            <Td key={index}>
              <Priority value={cellRenderValue} />
            </Td>
          );
        }

        return <Td key={index}>{cellRenderValue}</Td>;
      })}
    </Tr>
  );
};
