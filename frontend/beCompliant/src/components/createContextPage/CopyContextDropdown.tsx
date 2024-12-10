import { FormControl, FormLabel, Select, Skeleton } from '@kvib/react';
import { useFetchAllContexts } from '../../hooks/useFetchAllContexts';
import { Context } from '../../hooks/useFetchTeamContexts';
import { useSearchParams } from 'react-router-dom';

export function CopyContextDropdown({
  setCopyContext,
}: {
  setCopyContext: (context: string) => void;
}) {
  const [search] = useSearchParams();
  const tableId = search.get('tableId');
  const copyContext = search.get('copyContext');

  const { data: contexts, isPending: contextsIsLoading } =
    useFetchAllContexts();

  const contextsForTable: Context[] =
    contexts?.filter((context) => context.tableId === tableId) ?? [];

  const isDisabled = contextsForTable.length === 0;
  console.log(contextsIsLoading);

  return (
    <FormControl isDisabled={isDisabled}>
      <FormLabel
        style={{
          fontSize: 'small',
          fontWeight: 'bold',
        }}
      >
        Kopier svar fra eksisterende skjema
      </FormLabel>
      <Skeleton isLoaded={!contextsIsLoading}>
        <Select
          id="select"
          placeholder={
            isDisabled ? 'Ingen eksisterende skjema funnet' : 'Velg skjema'
          }
          onChange={(e) => setCopyContext(e.target.value)}
          bgColor="white"
          borderColor="gray.200"
          value={copyContext ?? undefined}
        >
          {contextsForTable?.map((context) => (
            <option key={context.id} value={context.id}>
              {context.name}
            </option>
          ))}
        </Select>
      </Skeleton>
    </FormControl>
  );
}
