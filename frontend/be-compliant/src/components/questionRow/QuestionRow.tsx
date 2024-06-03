import { Dispatch, SetStateAction } from 'react'
import { Td, Tr } from '@kvib/react'
import { Answer } from '../answer/Answer'
import './questionRow.css'
import { formatDateTime } from '../../utils/formatTime'
import { Fields, RecordType } from '../table/Table'
import { Field } from '../../hooks/datafetcher'

interface QuestionRowProps {
  record: RecordType
  choices: string[]
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>
  tableColumns: Field[]
}

export const QuestionRow = (props: QuestionRowProps) => {
  const arrayToString = (list: string[]): string => list.join(', ')
  return (
    <Tr>
      <Td>
        {props.record.fields.answer
          ? formatDateTime(props.record.fields.updated)
          : ''}
      </Td>
      <Td className="finished">{props.record.fields.status}</Td>

      {props.tableColumns.map((column: Field, index: number) => {
        const columnKey = column.name as keyof Fields
        const cellValue = props.record.fields[columnKey]
        const cellRenderValue = Array.isArray(cellValue)
          ? arrayToString(cellValue)
          : cellValue

        return <Td key={index}>{cellRenderValue}</Td>
      })}

      <Td className="answer">
        <Answer
          choices={props.choices}
          answer={props.record.fields.answer ? props.record.fields.answer : ''}
          record={props.record}
          setFetchNewAnswers={props.setFetchNewAnswers}
        />
      </Td>
    </Tr>
  )
}
