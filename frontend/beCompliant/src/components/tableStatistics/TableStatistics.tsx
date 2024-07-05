import { Text } from '@kvib/react'
import { RecordType } from '../../pages/TablePage'

interface TableStatisticsProps {
  filteredData: RecordType[]
}

export const TableStatistics = ({ filteredData }: TableStatisticsProps) => {
  const numberOfQuestions = filteredData.length
  const numberOfAnswers = filteredData.reduce((count, data) => {
    if (data.fields.Svar) {
      count++
    }
    return count
  }, 0)

  return (
    <Text style={{ margin: 20 }}>
      <Text as={'b'}>{numberOfAnswers}</Text> av {numberOfQuestions} spørsmål
      besvart
    </Text>
  )
}
