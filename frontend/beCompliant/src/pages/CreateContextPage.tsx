import { useSearchParams } from 'react-router-dom';
import { LockedCreateContextPage } from './LockedCreateContextPage';
import { UnlockedCreateContextPage } from './UnlockedCreateContextPage';
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import { useFetchTables } from '../hooks/useFetchTables';
import { Center, Heading, Icon, Spinner } from '@kvib/react';

export const CreateContextPage = () => {
  const [search] = useSearchParams();
  const locked = search.get('locked') === 'true';

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

  return locked ? (
    <LockedCreateContextPage userinfo={userinfo} tablesData={tablesData} />
  ) : (
    <UnlockedCreateContextPage userinfo={userinfo} tablesData={tablesData} />
  );
};
