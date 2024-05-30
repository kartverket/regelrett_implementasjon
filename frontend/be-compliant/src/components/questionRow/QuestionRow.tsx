import { Dispatch, SetStateAction } from "react";
import { Td, Tr } from "@kvib/react";
import { Answer } from "../answer/Answer";
import "./questionRow.css";
import { formatDateTime } from "../../utils/formatTime";
import { RecordType } from "../table/Table";

interface QuestionRowProps {
  record: RecordType;
  choices: string[] | [];
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  fetchNewAnswers: boolean;
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
        <Td>{props.record.fields.answer? formatDateTime(props.record.fields.updated) : ""}</Td>
        <Td className="question">{props.record.fields.Aktivitiet}</Td>
        <Td><div className={`circle ${sanitizeClassName(props.record.fields.Pri)}`}>{props.record.fields.Pri}</div></Td>
        <Td>{props.record.fields.Hvem?.join(", ")}</Td>
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
