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
import { sortData } from '../../utils/sorter'
import { useMetodeverkFetcher } from '../../hooks/datafetcher'

export type Fields = {
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
  const { data, dataError, choices } = useMetodeverkFetcher()
  const [fieldSortedBy, setFieldSortedBy] = useState<keyof Fields>();
  const [combinedData, setCombinedData] = useState<RecordType[]>()
  
  const updateToCombinedData = (answers: AnswerType[], data: RecordType[]): RecordType[]=> {
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
    const sortedData = sortData(combinedData ?? [], fieldSortedBy)
    setCombinedData(sortedData)
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
        <option value="status">Status</option>
        <option value="updated">Sist oppdatert</option>
      </Select>
      <div>
        {dataError ? (
          <div>{dataError}</div> // Display error if there is any
        ) : combinedData ? (
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
