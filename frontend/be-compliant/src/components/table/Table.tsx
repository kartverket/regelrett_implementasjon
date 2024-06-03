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
import { TableFilter } from '../tableFilter/TableFilter'
import { sortData } from '../../utils/sorter'
import { useMetodeverkFetcher } from '../../hooks/datafetcher'

export type Fields = {
  Kortnavn: string
  Pri: string
  Løpenummer: number
  Ledetid: string
  Aktivitiet: string
  Område: string
  Hvem: string[]
  Kode: string
  ID: string
  question: string
  updated: string
  answer: string
  actor: string
  status: string
}

export type RecordType = Record<string, Fields>

export type ActiveFilter = {
  filterName: string
  filterValue: string
}

export const MainTableComponent = () => {
  const [fetchNewAnswers, setFetchNewAnswers] = useState(true)
  const { answers } = useAnswersFetcher(fetchNewAnswers, setFetchNewAnswers)
  const { data, dataError, choices, tableMetaData } = useMetodeverkFetcher()
  const [fieldSortedBy, setFieldSortedBy] = useState<keyof Fields>()
  const [combinedData, setCombinedData] = useState<RecordType[]>([])
  const statusFilterOptions = ['Utfylt', 'Ikke utfylt']
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([])
  const [filteredData, setFilteredData] = useState<RecordType[]>([])

  const answerCounts =
    answers?.reduce((acc: { [x: string]: any }, answer: { answer: string }) => {
      acc[answer.answer] = (acc[answer.answer] || 0) + 1
      return acc
    }, {}) || {}

  const totalCount = answers?.length || 0

  const updateToCombinedData = (
    answers: AnswerType[],
    data: RecordType[]
  ): RecordType[] => {
    return data.map((item: RecordType) => {
      const match = answers?.find(
        (answer: AnswerType) => answer.questionId === item.fields.ID
      )
      const combinedData = {
        ...item,
        fields: {
          ...item.fields,
          ...match,
          status: match?.answer ? 'Utfylt' : 'Ikke utfylt',
        },
      }
      return combinedData
    })
  }

  useEffect(() => {
    const updatedData = updateToCombinedData(answers, data)
    setCombinedData(updatedData)
  }, [answers, data])

  useEffect(() => {
    const sortedData = sortData(combinedData ?? [], fieldSortedBy)
    setCombinedData(sortedData)
  }, [fieldSortedBy])

  const handleSortedData = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFieldSortedBy(e.target.value as keyof Fields)
  }

  const filterData = (
    data: RecordType[],
    filters: ActiveFilter[]
  ): RecordType[] => {
    if (!filters.length || !data.length) return data

    return filters.reduce((filteredData, filter) => {
      const fieldName = filter.filterName as keyof Fields

      if (!fieldName || !(fieldName in data[0].fields)) {
        console.error(`Invalid filter field name: ${filter.filterName}`)
        return filteredData
      }

      return filteredData.filter(
        (record) => record.fields[fieldName] === filter.filterValue
      )
    }, data)
  }

  useEffect(() => {
    const filteredData = filterData(combinedData, activeFilters)
    setFilteredData(filteredData)
  }, [activeFilters, combinedData, fieldSortedBy])

  const filterOrCombinedData = (
    filteredData: RecordType[],
    combinedData: RecordType[]
  ): RecordType[] | null => {
    if (filteredData.length) return filteredData
    else if (combinedData.length) return combinedData
    return null
  }

  const dataToDisplay = filterOrCombinedData(filteredData, combinedData)

  return (
    <>
      <div className="statistics">
        <h1>Teamnavn</h1>
        <b>Tallene viser oppdatert svarinformasjon</b>
        <div>Totalt antall svar: {totalCount}</div>
        <ul>
          {Object.keys(answerCounts).map((answer, index) => (
            <li key={index}>
              {answer}: {answerCounts[answer]}
            </li>
          ))}
        </ul>
      </div>
      <TableFilter
        filterOptions={statusFilterOptions}
        filterName={'status'}
        activeFilters={activeFilters}
        setActiveFilters={setActiveFilters}
      />
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
        ) : dataToDisplay && tableMetaData ? (
          <TableContainer>
            <Table
              variant="striped"
              colorScheme="green"
              style={{ tableLayout: 'auto' }}
            >
              <Thead>
                <Tr>
                  <Th>Når</Th>
                  <Th>Status</Th>
                  {tableMetaData.fields.map((field, index) => (
                    <Th key={index}>{field.name}</Th>
                  ))}
                  <Th>Svar</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataToDisplay.map((item: RecordType, index: number) => (
                  <QuestionRow
                    key={index}
                    record={item}
                    choices={choices}
                    setFetchNewAnswers={setFetchNewAnswers}
                    tableColumns={tableMetaData.fields}
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
