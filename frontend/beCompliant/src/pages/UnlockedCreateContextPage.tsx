import { useUser } from '../hooks/useUser';
import { CopyContextDropdown } from '../components/createContextPage/CopyContextDropdown';
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Select,
  Skeleton,
  Spinner,
  Stack,
  Text,
} from '@kvib/react';
import { useSearchParams } from 'react-router-dom';
import { FormEvent, useCallback, useEffect } from 'react';
import { Form } from '../api/types';

type Props = {
  formsData: { data: Form[] | undefined; isPending: boolean };
  handleSumbit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isButtonDisabled: boolean;
  setFormId: (newFormId: string) => void;
  name: string | null;
  teamId: string | null;
};

export const UnlockedCreateContextPage = ({
  formsData,
  handleSumbit,
  isLoading,
  isButtonDisabled,
  setFormId,
  name,
  teamId,
}: Props) => {
  const [search, setSearch] = useSearchParams();
  const tableId = search.get('tableId');

  const {
    data: userinfo,
    isPending: isUserinfoLoading,
    isError: isUserinfoError,
  } = useUser();

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

  useEffect(() => {
    if (name == null) {
      setName('');
    }
  }, [
    userinfo,
    teamId,
    name,
    tableId,
    formsData,
    setTeamId,
    setName,
    setFormId,
  ]);

  if (isUserinfoError) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size="md">Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginTop="8rem"
    >
      <form onSubmit={handleSumbit}>
        <Text fontSize="3xl" fontWeight="bold" mb="32px">
          Opprett sikkerhetsskjema
        </Text>
        <Stack gap="16px">
          <FormControl>
            <FormLabel
              style={{
                fontSize: 'small',
                fontWeight: 'bold',
              }}
            >
              Velg team
            </FormLabel>
            <Skeleton isLoaded={!isUserinfoLoading}>
              <Select
                id="select"
                placeholder="Velg team"
                onChange={(e) => setTeamId(e.target.value)}
                required
                bgColor="white"
                borderColor="gray.200"
                value={teamId ?? undefined}
              >
                {userinfo?.groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.displayName}
                  </option>
                ))}
              </Select>
            </Skeleton>
          </FormControl>
          <FormControl>
            <FormLabel
              style={{
                fontSize: 'small',
                fontWeight: 'bold',
              }}
            >
              Velg sikkerhetsskjema
            </FormLabel>
            <Skeleton isLoaded={!formsData.isPending}>
              <Select
                id="tableSelect"
                placeholder="Velg skjema"
                required
                bgColor="white"
                borderColor="gray.200"
                onChange={(e) => setFormId(e.target.value)}
                value={tableId ?? undefined}
              >
                {formsData.data?.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </Select>
            </Skeleton>
          </FormControl>
          {tableId && tableId.trim() && teamId && teamId.trim() && (
            <CopyContextDropdown setCopyContext={setCopyContext} />
          )}

          <FormControl>
            <FormLabel
              style={{
                fontSize: 'small',
                fontWeight: 'bold',
              }}
            >
              Navn på skjemautfylling
            </FormLabel>
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
          <Button
            type="submit"
            variant="primary"
            colorScheme="blue"
            disabled={isButtonDisabled}
          >
            {isLoading ? <Spinner size="sm" /> : 'Opprett skjema'}
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};
