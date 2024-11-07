import { UserInfo } from '../hooks/useFetchUserinfo';
import { CopyContextDropdown } from '../components/createContextPage/CopyContextDropdown';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@kvib/react';
import { Form, useSearchParams } from 'react-router-dom';
import { FormEvent, useCallback, useEffect } from 'react';
import { Table } from '../api/types';

type Props = {
  userinfo: { data: UserInfo | undefined; isPending: boolean };
  tablesData: { data: Table[] | undefined; isPending: boolean };
  handleSumbit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isButtonDisabled: boolean;
  setTableId: (newTableId: string) => void;
  name: string | null;
  teamId: string | null;
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
}: Props) => {
  const [search, setSearch] = useSearchParams();
  const tableId = search.get('tableId');
  const copyContext = search.get('copyContext');

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

  const setCopyContext = useCallback(
    (newCopyContext: string) => {
      search.set('copyContext', newCopyContext);
      setSearch(search);
    },
    [search, setSearch]
  );

  // Effect to set default values
  useEffect(() => {
    if (teamId == null) {
      if (userinfo.data?.groups && userinfo.data.groups.length > 0) {
        setTeamId(userinfo.data.groups[0].id);
      }
    }

    if (name == null) {
      setName('');
    }

    if (tableId == null) {
      if (tablesData.data && tablesData.data.length > 0) {
        setTableId(tablesData.data[0].id);
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
            <Skeleton isLoaded={!userinfo.isPending}>
              <Select
                id="select"
                placeholder="Velg team"
                onChange={(e) => setTeamId(e.target.value)}
                required
                bgColor="white"
                borderColor="gray.200"
                value={teamId ?? undefined}
              >
                {userinfo.data?.groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.displayName}
                  </option>
                ))}
              </Select>
            </Skeleton>
          </FormControl>
        </Box>
        <Box marginBottom="1rem">
          <FormLabel htmlFor="tableSelect">Velg sikkerhetsskjema</FormLabel>
          <FormControl>
            <Skeleton isLoaded={!tablesData.isPending}>
              <Select
                id="tableSelect"
                placeholder="Velg skjema"
                required
                bgColor="white"
                borderColor="gray.200"
                onChange={(e) => setTableId(e.target.value)}
                value={tableId ?? undefined}
              >
                {tablesData.data?.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </Select>
            </Skeleton>
          </FormControl>
        </Box>
        {tableId && tableId.trim() && teamId && teamId.trim() && (
          <CopyContextDropdown
            tableId={tableId}
            teamId={teamId}
            copyContext={copyContext}
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
