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
import { Form } from 'react-router-dom';
import { FormEvent } from 'react';
import { Table } from '../api/types';
import { CopyContextDropdown } from '../components/createContextPage/CopyContextDropdown';
import { useSearchParams } from 'react-router-dom';

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

export const LockedCreateContextPage = ({
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
  const teamDisplayName = userinfo.groups.find(
    (group) => group.id === teamId
  )?.displayName;
  const [search, setSearch] = useSearchParams();
  const tableId = search.get('tableId');

  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      marginTop="8rem"
    >
      <Form style={{ width: '40ch' }} onSubmit={handleSumbit}>
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
            <Text fontSize="sm">{teamDisplayName}</Text>
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
        {tableId && tableId.trim() && teamId && teamId.trim() && (
          <CopyContextDropdown
            tableId={tableId}
            teamId={teamId}
            setCopyContext={setCopyContext}
          />
        )}
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
