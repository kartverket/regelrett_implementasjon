import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Select,
  Spinner,
  Stack,
} from '@kvib/react';
import { Form, useNavigate, useSearchParams } from 'react-router-dom';
import { useSubmitContext } from '../hooks/useSubmitContext';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useFetchTables } from '../hooks/useFetchTables';

export const CreateContextPage = () => {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const teamId = search.get('teamId');
  const name = search.get('name');
  const tableId = search.get('tableId');
  const redirect = search.get('redirect');

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

  const setTableId = useCallback(
    (newTableId: string) => {
      search.set('tableId', newTableId);
      setSearch(search);
    },
    [search, setSearch]
  );

  const {
    data: userinfo,
    isPending: isUserinfoLoading,
    isError: isUserinfoError,
  } = useFetchUserinfo();

  const {
    data: tablesData,
    error: tablesError,
    isPending: tablesIsPending,
  } = useFetchTables();

  const { mutate: submitContext } = useSubmitContext();

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (teamId && name && tableId) {
      setIsSubmitting(true); // Start submission
      submitContext(
        { teamId, tableId, name },
        {
          onSuccess: (data) => {
            setIsSubmitting(false);
            if (redirect) {
              const incomingRedirect = decodeURIComponent(redirect)
                .replace('{contextId}', data.data.id)
                .replace('{contextName}', data.data.name)
                .replace(
                  '{tableName}',
                  tablesData?.find((table) => table.id === data.data.tableId)
                    ?.name ?? tableId
                );
              const fullRedirect = new URL(incomingRedirect);
              const newRedirect = new URL(
                `${window.location.origin}/context/${data.data.id}`
              );
              fullRedirect.searchParams.set(
                'redirect',
                `${newRedirect.toString()}`
              );
              window.location.href = fullRedirect.toString();
            } else {
              navigate(`/context/${data.data.id}`);
            }
          },
          onError: () => {
            setIsSubmitting(false);
          },
        }
      );
    } else {
      console.error('teamId, tableId, and contextName must be provided');
    }
  };

  if (isUserinfoLoading || tablesIsPending) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }
  if (isUserinfoError || tablesError) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size="md">Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  const isButtonDisabled = !teamId || !tableId || !name || isSubmitting;

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginTop="8rem"
    >
      <Form style={{ width: '40%' }} onSubmit={handleSubmit}>
        <Heading size="lg" marginBottom="2rem">
          Opprett kontekst
        </Heading>
        <Box marginBottom="1rem">
          <FormLabel htmlFor="select">Velg team</FormLabel>
          <FormControl>
            <Select
              id="select"
              value={teamId ?? ''}
              onChange={(e) => setTeamId(e.target.value)}
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
          <FormLabel htmlFor="tableSelect">Velg tabell</FormLabel>
          <FormControl>
            <Select
              id="tableSelect"
              value={tableId ?? ''}
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
        <Box marginBottom="1rem">
          <FormControl>
            <FormLabel htmlFor="contextName">Navn på kontekst</FormLabel>
            <Input
              id="contextName"
              type="text"
              placeholder="Skriv inn navn på kontekst"
              value={name ?? ''}
              onChange={(e) => setName(e.target.value)}
              isRequired
            />
          </FormControl>
        </Box>
        <Button type="submit" variant="primary" disabled={isButtonDisabled}>
          {isSubmitting ? <Spinner size="sm" /> : 'Opprett'}
        </Button>
      </Form>
    </Stack>
  );
};
