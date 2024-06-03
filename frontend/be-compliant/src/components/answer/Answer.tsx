import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Select } from '@kvib/react'
import { RecordType } from '../table/Table'

export type AnswerType = {
  questionId: string
  answer: string
  updated: string
}

interface AnswerProps {
  choices: string[] | []
  answer: string
  record: RecordType
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>
}

export const Answer = (props: AnswerProps) => {
  const [choices, setChoices] = useState<string[]>(props.choices)
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    props.answer
  )

  useEffect(() => {
    setChoices(props.choices)
    setSelectedAnswer(props.answer)
  }, [props.choices, props.answer])

  const submitAnswer = async (answer: string, record: RecordType) => {
    const url = 'http://localhost:8080/answer' // TODO: Place dev url to .env file
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actor: 'Unknown',
        questionId: record.fields.ID,
        question: record.fields.Aktivitiet,
        answer: answer,
        updated: '',
      }),
    }
    try {
      const response = await fetch(url, settings)
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }
      props.setFetchNewAnswers(true)
    } catch (error) {
      console.error('There was an error with the submitAnswer request:', error)
    }
    return
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswer: string = e.target.value
    setSelectedAnswer(newAnswer)
    submitAnswer(newAnswer, props.record)
  }

  return (
    <Select
      aria-label="select"
      placeholder="Velg alternativ"
      onChange={handleChange}
      value={selectedAnswer}
    >
      {choices.map((choice, index) => (
        <option value={choice} key={index}>
          {choice}
        </option>
      ))}
    </Select>
  )
}
