import { useNavigate, useSearchParams } from 'react-router-dom';
import { LockedCreateContextPage } from './LockedCreateContextPage';
import { UnlockedCreateContextPage } from './UnlockedCreateContextPage';
import { useFetchForms } from '../hooks/useFetchForms';
import { Center, Heading, Icon } from '@kvib/react';
import { useSubmitContext } from '../hooks/useSubmitContext';
import { FormEvent, useCallback } from 'react';

export const CreateContextPage = () => {
  const [search, setSearch] = useSearchParams();
  const navigate = useNavigate();
  const locked = search.get('locked') === 'true';

  const teamId = search.get('teamId');
  const name = search.get('name');
  const formId = search.get('formId');
  const redirect = search.get('redirect');

  const setFormId = useCallback(
    (newFormId: string) => {
      search.set('formId', newFormId);
      setSearch(search);
    },
    [search, setSearch]
  );

  const copyContext = search.get('copyContext');

  const { mutate: submitContext, isPending: isLoading } = useSubmitContext();

  const {
    data: formData,
    isPending: formIsPending,
    error: formError,
  } = useFetchForms();
  if (formError) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size="md">Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  const isButtonDisabled = !teamId || !formId || !name || isLoading;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (teamId && name && formId) {
      submitContext(
        { teamId, formId: formId, name, copyContext },
        {
          onSuccess: (data) => {
            if (redirect) {
              const incomingRedirect = decodeURIComponent(redirect)
                .replace('{contextId}', data.data.id)
                .replace('{tableId}', formId) // Dette er til FRISK tror jeg - vent med å oppdatere?
                .replace('{contextName}', data.data.name)
                .replace(
                  '{tableName}',
                  formData?.find((form) => form.id === data.data.formId)
                    ?.name ?? formId
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
        }
      );
    } else {
      console.error('teamId, formId, and contextName must be provided');
    }
  };

  return locked ? (
    <LockedCreateContextPage
      formsData={{
        data: formData,
        isPending: formIsPending,
      }}
      handleSumbit={handleSubmit}
      isLoading={isLoading}
      isButtonDisabled={isButtonDisabled}
      setFormId={setFormId}
      name={name}
      teamId={teamId}
    />
  ) : (
    <UnlockedCreateContextPage
      formsData={{
        data: formData,
        isPending: formIsPending,
      }}
      handleSumbit={handleSubmit}
      isLoading={isLoading}
      isButtonDisabled={isButtonDisabled}
      setFormId={setFormId}
      name={name}
      teamId={teamId}
    />
  );
};
