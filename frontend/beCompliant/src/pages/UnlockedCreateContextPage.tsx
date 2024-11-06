import { UserInfo } from '../hooks/useFetchUserinfo';
import { CopyContextDropdown } from '../components/createContextPage/CopyContextDropdown';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Spinner,
  Stack,
  Text,
} from '@kvib/react';
import { Form, useSearchParams } from 'react-router-dom';
import { FormEvent, useCallback, useEffect } from 'react';
import { Table } from '../api/types';

type Props = {
  userinfo: UserInfo;
  tablesData: Table[];
  handleSumbit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isButtonDisabled: boolean;
  setTableId: (newTableId: string) => void;
  name: string | null;
  teamId: string | null;
  setCopyContext: (context: string) => void;
};

export const UnlockedCreateContextPage = ({
  userinfo,
  tablesData,
  handleSumbit,
  isLoading,
  isButtonDisabled,
  setTableId,
  name,
  teamId,
  setCopyContext,
}: Props) => {
  const [search, setSearch] = useSearchParams();
  const tableId = search.get('tableId');

  const setTeamId = useCallback(
    (newTeamId: string) => {
      search.set('teamId', newTeamId);
      setSearch(search);
    },
    [search, setSearch]
  );

  const setName = useCallback(
    (newName: string) => {
      search.set('name', newName);
      setSearch(search);
    },
    [search, setSearch]
  );

  // Effect to set default values
  useEffect(() => {
    if (teamId == null) {
      if (userinfo?.groups && userinfo.groups.length > 0) {
        setTeamId(userinfo.groups[0].id);
      }
    }

    if (name == null) {
      setName('');
    }

    if (tableId == null) {
      if (tablesData && tablesData.length > 0) {
        setTableId(tablesData[0].id);
      }
    }
  }, [
    userinfo,
    teamId,
    name,
    tableId,
    tablesData,
    setTeamId,
    setName,
    setTableId,
  ]);

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginTop="8rem"
    >
      <Form style={{ width: '40%' }} onSubmit={handleSumbit}>
        <Text fontSize="3xl" fontWeight="bold" mb="32px">
          Opprett sikkerhetsskjema
        </Text>
        <Box marginBottom="1rem">
          <FormLabel htmlFor="select">Velg team</FormLabel>
          <FormControl>
            <Select
              id="select"
              placeholder="Velg team"
              onChange={(e) => setTeamId(e.target.value)}
              required
              bgColor="white"
              borderColor="gray.200"
            >
              {userinfo.groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.displayName}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box marginBottom="1rem">
          <FormLabel htmlFor="tableSelect">Velg sikkerhetsskjema</FormLabel>
          <FormControl>
            <Select
              id="tableSelect"
              placeholder="Velg skjema"
              required
              bgColor="white"
              borderColor="gray.200"
              onChange={(e) => setTableId(e.target.value)}
            >
              {tablesData?.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        {tableId && tableId.trim() && teamId && teamId.trim() && (
          <CopyContextDropdown
            tableId={tableId}
            teamId={teamId}
            setCopyContext={setCopyContext}
          />
        )}
        <Box marginBottom="50px">
          <FormControl>
            <FormLabel htmlFor="contextName">Navn på skjemautfylling</FormLabel>
            <Input
              id="contextName"
              type="text"
              placeholder="Skriv inn navn på skjemautfylling"
              value={name ?? ''}
              onChange={(e) => setName(e.target.value)}
              required
              bgColor="white"
              borderColor="gray.200"
            />
          </FormControl>
        </Box>
        <Button
          type="submit"
          variant="primary"
          colorScheme="blue"
          disabled={isButtonDisabled}
        >
          {isLoading ? <Spinner size="sm" /> : 'Opprett skjema'}
        </Button>
      </Form>
    </Stack>
  );
};
