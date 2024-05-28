import { Dispatch, SetStateAction } from "react";
import { Td, Tr } from "@kvib/react";
import { Answer, AnswerType, Fields } from "../answer/Answer";

interface QuestionRowProps {
  record: Record<string, Fields>;
  choices: string[] | [];
  answer: AnswerType;
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  fetchNewAnswers: boolean;
}

export const QuestionRow = (props: QuestionRowProps) => {
  return (
    <Tr>
      <Td>{props.record.fields.ID} </Td>
      <Td>{props.record.fields.Aktivitiet}</Td>
      <Td>{props.answer ? "Utfylt" : "Ikke utfylt"}</Td>
      <Td>
        <Answer
          choices={props.choices}
          answer={props.answer}
          record={props.record}
          setFetchNewAnswers={props.setFetchNewAnswers}
          fetchNewAnswers={props.fetchNewAnswers}
        />
      </Td>
    </Tr>
  );
};
