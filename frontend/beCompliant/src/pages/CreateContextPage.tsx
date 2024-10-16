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
import { Form } from 'react-router-dom';
import { useSubmitContext } from '../hooks/useSubmitContext';
import { FormEvent, useEffect, useState } from 'react';

export const CreateContextPage = () => {
  const {
    data: userinfo,
    isPending: isUserinfoLoading,
    isError: isUserinfoError,
  } = useFetchUserinfo();

  const { mutate: submitContext } = useSubmitContext();

  const [teamId, setTeamId] = useState<string>('');
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (userinfo?.groups && userinfo.groups.length > 0) {
      setTeamId(userinfo.groups[0].id);
    }
  }, [userinfo]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (teamId && name) {
      submitContext({ teamId, name: name });
    } else {
      console.error('Both teamId and contextName must be provided');
    }
  };

  if (isUserinfoLoading) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }
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
      <Form style={{ width: '40%' }} onSubmit={handleSubmit}>
        <Heading size="lg" marginBottom="2rem">
          Opprett kontekst
        </Heading>
        <Box marginBottom="1rem">
          <FormLabel htmlFor="select">Velg team</FormLabel>
          <FormControl>
            <Select
              id="select"
              value={teamId}
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
          <FormControl>
            <FormLabel htmlFor="contextName">Navn på kontekst</FormLabel>
            <Input
              id="contextName"
              type="text"
              placeholder="Skriv inn navn på kontekst"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
            />
          </FormControl>
        </Box>
        <Button type="submit" variant="primary">
          Opprett
        </Button>
      </Form>
    </Stack>
  );
};
