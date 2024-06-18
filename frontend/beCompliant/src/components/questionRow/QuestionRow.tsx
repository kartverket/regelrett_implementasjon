import { Dispatch, SetStateAction } from 'react';
import { Td, Tr } from '@kvib/react';
import { Answer } from '../answer/Answer';
import './questionRow.css';
import { formatDateTime } from '../../utils/formatTime';
import { Fields, RecordType } from '../../pages/Table';
import { Field } from '../../hooks/datafetcher';
import { ChoiceTag } from '../choiceTag/ChoiceTag';

interface QuestionRowProps {
  record: RecordType;
  choices: string[];
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  tableColumns: Field[];
  team?: string;
  key: string;
}

export const QuestionRow = ({
    record,
    choices,
    setFetchNewAnswers,
    tableColumns,
    team,
    key,
  }: QuestionRowProps) => {
  const arrayToString = (list: string[]): string => list.join(', ');
  return (
    <Tr key={key}>
      <Td>{record.fields.Svar ? formatDateTime(record.fields.updated) : ''}</Td>
      <Td className="finished">{record.fields.Status}</Td>

      {tableColumns.map((column: Field) => {
        const columnKey = column.name as keyof Fields;
        if (columnKey === 'Svar') {
          return (
            <Td className="answer" key={key}>
              <Answer
                key={key}
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

        if(!cellValue){
          return <Td key={key} />
        }

        const cellRenderValue = Array.isArray(cellValue)
          ? arrayToString(cellValue)
          : cellValue.toString();

        const columnOptions = column.options;
        const columnChoices = columnOptions ? columnOptions.choices : []

        if(columnChoices && columnChoices.length > 0){
          return (
            <Td key={key}>
              <ChoiceTag cellValue={cellValue} cellRenderValue={cellRenderValue} choices={columnChoices}/>
            </Td>
          );
        }

        return <Td key={key}>{cellRenderValue}</Td>;
      })}
    </Tr>
  );
};
