import { Dispatch, SetStateAction } from 'react'
import { Card, Flex, Td, Tr } from '@kvib/react'
import { Answer } from '../answer/Answer'
import './questionRow.css'
import { formatDateTime } from '../../utils/formatTime'
import { RecordType } from '../table/Table'
import { useTheme } from '@kvib/react'

interface QuestionRowProps {
  record: RecordType
  choices: string[] | []
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>
  fetchNewAnswers: boolean
  index?: number
}

const sanitizeClassName = (name: string) => {
  if (name?.includes('(') && name?.includes(')')) {
    return name.replace(/\(|\)/g, '-')
  }
  return name
}

export const QuestionRow = (props: QuestionRowProps) => {
  return (
    <Tr>
      <Td>
        {props.record.fields.answer
          ? formatDateTime(props.record.fields.updated)
          : ''}
      </Td>
      <Td className="question">{props.record.fields.Aktivitiet}</Td>
      <Td>
        <div className={`circle ${sanitizeClassName(props.record.fields.Pri)}`}>
          {props.record.fields.Pri}
        </div>
      </Td>
      <Td>{props.record.fields.Hvem?.join(', ')}</Td>
      <Td className="finished">{props.record.fields.status}</Td>
      <Td className="answer">
        <Answer
          choices={props.choices}
          answer={props.record.fields.answer}
          record={props.record}
          setFetchNewAnswers={props.setFetchNewAnswers}
          fetchNewAnswers={props.fetchNewAnswers}
        />
      </Td>
    </Tr>
  )
}

export const QuestionRowAsCard = (props: QuestionRowProps) => {
  const theme = useTheme()

  return (
    <Card
      padding={2}
      backgroundColor={
        props.index
          ? props?.index % 2 === 0
            ? theme.colors.green[100]
            : 'white'
          : 'white'
      }
    >
      <Flex alignItems="center">
        <Flex flex={1}>
          {props.record.fields.answer
            ? formatDateTime(props.record.fields.updated)
            : ''}
        </Flex>
        <Flex flex={3}>{props.record.fields.Aktivitiet}</Flex>
        <Flex flex={1}>{props.record.fields.Pri}</Flex>
        <Flex flex={1}>{props.record.fields.Hvem?.join(', ')}</Flex>
        <Flex flex={1}>{props.record.fields.status}</Flex>
        <Flex flex={1}>
          <Answer
            choices={props.choices}
            answer={props.record.fields.answer}
            record={props.record}
            setFetchNewAnswers={props.setFetchNewAnswers}
            fetchNewAnswers={props.fetchNewAnswers}
          />
        </Flex>
      </Flex>
    </Card>
  )
}
