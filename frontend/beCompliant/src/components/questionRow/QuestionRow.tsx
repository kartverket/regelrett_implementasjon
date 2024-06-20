import { Dispatch, SetStateAction } from 'react';
import { Td, Tr } from '@kvib/react';
import { Answer } from '../answer/Answer';
import './questionRow.css';
import { formatDateTime } from '../../utils/formatTime';
import { Fields, RecordType } from '../../pages/Table';
import { Choice, Field } from '../../hooks/datafetcher';
import { ChoiceTag } from '../choiceTag/ChoiceTag';

interface QuestionRowProps {
  record: RecordType;
  choices: Choice[];
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
    <Tr key={record.fields.ID}>
      <Td>{record.fields.Svar ? formatDateTime(record.fields.updated) : ''}</Td>

      {tableColumns.map((column: Field) => {
        const columnKey = column.name as keyof Fields;
        if (columnKey === 'Svar') {
          return (
            <Td className="answer" key={record.fields.ID}>
              <Answer
                choices={choices}
                answer={record.fields.Svar ? record.fields.Svar : ''}
                record={record}
                setFetchNewAnswers={setFetchNewAnswers}
                team={team}
                comment={record.fields.comment ? record.fields.comment : ''}
              />
            </Td>
          );
        }
        const cellValue = record.fields[columnKey];

        if(!cellValue){
          return <Td key={column.id}/>
        }

        const cellRenderValue = Array.isArray(cellValue)
          ? arrayToString(cellValue)
          : cellValue.toString();

        const columnOptions = column.options;
        const columnChoices = columnOptions ? columnOptions.choices : [];

        if (columnChoices && columnChoices.length > 0) {
          return (
            <Td key={column.id}>
              <ChoiceTag cellValue={cellValue} cellRenderValue={cellRenderValue} choices={columnChoices}/>
            </Td>
          );
        }

        return <Td key={column.id}>{cellRenderValue}</Td>;
      })}
    </Tr>
  );
};
