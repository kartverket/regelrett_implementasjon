import { UserInfo } from '../hooks/useFetchUserinfo';
import {
  Box,
  Button,
  Flex,
  FormControl,
  Select,
  Spinner,
  Stack,
  Text,
} from '@kvib/react';
import { Form, useNavigate, useSearchParams } from 'react-router-dom';
import { useSubmitContext } from '../hooks/useSubmitContext';
import { FormEvent, useCallback, useState } from 'react';
import { Table } from '../api/types';

type Props = {
  userinfo: UserInfo;
  tablesData: Table[];
};

export const LockedCreateContextPage = ({ userinfo, tablesData }: Props) => {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const teamId = search.get('teamId');
  const name = search.get('name');
  const tableId = search.get('tableId');
  const redirect = search.get('redirect');

  const setTableId = useCallback(
    (newTableId: string) => {
      search.set('tableId', newTableId);
      setSearch(search);
    },
    [search, setSearch]
  );

  const { mutate: submitContext } = useSubmitContext();

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

  const isButtonDisabled = !teamId || !tableId || !name || isSubmitting;

  const getTeamDisplayName = (teamId: string | null) => {
    return userinfo.groups.find((group) => group.id === teamId)?.displayName;
  };

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginTop="8rem"
    >
      <Form style={{ width: '40ch' }} onSubmit={handleSubmit}>
        <Text fontSize="3xl" fontWeight="bold" mb="32px">
          Opprett sikkerhetsskjema
        </Text>
        <Text fontSize="sm" mb="15px">
          Velg hvilket sikkerhetsskjema du skal fylle ut for:
        </Text>
        <Flex gap="20px">
          <Flex flexDirection="column" gap="10px">
            <Text fontSize="sm" fontWeight="bold">
              Funksjon:
            </Text>
            <Text fontSize="sm" fontWeight="bold">
              Team:
            </Text>
          </Flex>
          <Flex flexDirection="column" gap="10px">
            <Text fontSize="sm">{name}</Text>
            <Text fontSize="sm">{getTeamDisplayName(teamId)}</Text>
          </Flex>
        </Flex>

        <Box marginBottom="50px" mt="40px">
          <Text fontWeight="bold" fontSize="sm" mb="10px">
            Velg sikkerhetsskjema du ønsker å opprette
          </Text>
          <FormControl>
            <Select
              id="tableSelect"
              onChange={(e) => setTableId(e.target.value)}
              placeholder="Velg skjema"
              required
              w="fit-content"
              bgColor="white"
              borderColor="gray.200"
            >
              {tablesData?.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          type="submit"
          variant="primary"
          colorScheme="blue"
          disabled={isButtonDisabled}
        >
          {isSubmitting ? <Spinner size="sm" /> : 'Opprett skjema'}
        </Button>
      </Form>
    </Stack>
  );
};
