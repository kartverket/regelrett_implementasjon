import { RecordType } from './Table'
import { useMetodeverkFetcher } from '../hooks/datafetcher'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Center,
  Link,
  Spinner,
  StackDivider,
  VStack,
} from '@kvib/react'
import { Link as ReactRouterLink } from 'react-router-dom'

const FrontPage = () => {
  const { data, dataError } = useMetodeverkFetcher()

  const getUniqueTeams = (records: RecordType[]) => {
    const teams = records.flatMap((record) => record.fields.Hvem)
    const uniqueTeams = new Set(teams)
    return Array.from(uniqueTeams)
  }

  if (dataError) {
    return (
      <Center style={{ height: '100svh' }}>
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Something went wrong</AlertTitle>
        </Alert>
      </Center>
    )
  }

  if (data.length === 0) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" label="Laster..." />
      </Center>
    )
  }

  return (
    <Center>
      <VStack
        align="start"
        divider={<StackDivider />}
        style={{ width: '60ch' }}
      >
        {getUniqueTeams(data).map((team) => {
          return (
            <Link as={ReactRouterLink} to={`team/${team}`}>
              {team}
            </Link>
          )
        })}
      </VStack>
    </Center>
  )
}

export default FrontPage
