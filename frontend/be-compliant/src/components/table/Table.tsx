import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Select,
} from '@kvib/react'
import { useState, useEffect } from 'react'
import { useAnswersFetcher } from '../../hooks/answersFetcher'
import { QuestionRow } from '../questionRow/QuestionRow'
import { AnswerType } from '../answer/Answer'

type MetaData = {
  id: string
  name: string
  primaryFieldId: string
  views: View[]
  fields: Field[]
}

type View = {
  id: string
  name: string
  type: string
}

type Field = {
  id: string
  name: string
  type: string
  options: Option | null
}

type Option = {
  inverseLinkFieldId: string
  isReversed: boolean
  linkedTableId: string
  prefersSingleRecordLink: boolean
  choices: Choice[]
}

  type Choice = {
    id: string;
    name: string;
    color: string;
  }

  type Fields = {
    Kortnavn: string;
    Pri: string;
    Løpenummer: number;
    Ledetid: string;
    Aktivitiet: string;
    Område: string;
    Hvem: string[];
    Kode: string;
    ID: string; 
    question: string;
    updated: string;
    answer: string;
    actor: string;
    status: string;
  }

  export type RecordType = Record<string, Fields>


export const MainTableComponent = () => {
  const [fetchNewAnswers, setFetchNewAnswers] = useState(true);
  const { answers } = useAnswersFetcher(fetchNewAnswers, setFetchNewAnswers);
  const [data, setData] = useState<RecordType[]>([]);
  const [metadata, setMetadata] = useState<MetaData[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);
  const [choices, setChoices] = useState<string[] | []>([]);
  const [fieldSortedBy, setFieldSortedBy] = useState<keyof Fields>();
  const [combinedData, setCombinedData] = useState<RecordType[]>()
  
  const updateToCombinedData = (answers: AnswerType[], data: RecordType[]): RecordType[] => {
    return data.map((item: RecordType) => {
      const match = answers?.find((answer: AnswerType) => answer.questionId === item.fields.ID)
      const combinedData =  {...item, fields: { ...item.fields, ...match, status: match?.answer ? "Utfylt" : "Ikke utfylt"}} 
      return combinedData
    })
  }

  useEffect(() => {
    const updatedData = updateToCombinedData(answers, data)
    setCombinedData(updatedData);
  }, [answers, data])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/metodeverk') // TODO: Place dev url to .env file
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const jsonData = await response.json()
        setData(jsonData['metodeverkData']['records'])
        setMetadata(jsonData['metaData']['tables'])
      } catch (error) {
        setDataError('Error fetching data')
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (metadata.length > 0) {
      const aktivitetsTable = metadata.filter(
        (table: MetaData) => table.id === 'tblLZbUqA0XnUgC2v'
      )[0]

      if (!aktivitetsTable) {
        throw new Error(`Failed to fetch aktivitetstable`)
      }

      const optionField = aktivitetsTable.fields.filter(
        (field: Field) => field.id === 'fldbHk1Ce1Ccw5QvF'
      )[0]
      const options = optionField.options
      const answerOptions = options?.choices.map(
        (choice: Choice) => choice.name
      )
      setChoices(answerOptions ?? [])
    }
  }, [metadata])

  const sortData = (
    data: RecordType[],
    field?: keyof Fields,
  ): RecordType[] => {
    if (!field) {
      return data
    }
    const sortedData = [...data]
    sortedData.sort((recordA, recordB) => {
      const fieldA = Object.values(recordA)[2]
      const fieldB = Object.values(recordB)[2]

      const valueA = fieldA[field]
      const valueB = fieldB[field]

      if (valueA === undefined && valueB === undefined) return 0
      if (valueA === undefined) return 1
      if (valueB === undefined) return -1

      if (valueA < valueB) return -1
      if (valueA > valueB) return 1
      return 0
    })
    return sortedData
  }

  useEffect(() => {
    const sortedData = sortData(data, fieldSortedBy)
    setData(sortedData)
  }, [fieldSortedBy])

  const handleSortedData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldSortedBy(e.target.value as keyof Fields);
  };
 
  return (
    <>
      <Select
        aria-label="select"
        placeholder="Sortér etter"
        onChange={handleSortedData}
      >
        <option value="Pri">Prioritet</option>
      </Select>
      <div>
        {dataError ? (
          <div>{dataError}</div> // Display error if there is any
        ) : data.length > 0 ? (
          <TableContainer>
            <Table
              variant="striped"
              colorScheme="green"
              style={{ tableLayout: 'auto' }}
            >
              <Thead>
                <Tr>
                  <Th>NÅR</Th>
                  <Th>SPØRSMÅL</Th>
                  <Th>PRI</Th>
                  <Th>STATUS</Th>
                  <Th>SVAR</Th>
                </Tr>
              </Thead>
              <Tbody>
              {combinedData?.map((item: RecordType, index: number) => (
                  <QuestionRow
                    key={index}
                    record={item}
                    choices={choices}
                    setFetchNewAnswers={setFetchNewAnswers}
                    fetchNewAnswers={fetchNewAnswers}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        ) : (
          'No data to display...'
        )}
      </div>
    </>
  )
}
