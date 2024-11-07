import { Box, FormControl, FormLabel, Select, Spinner } from '@kvib/react';
import { useFetchTeamTableContexts } from '../../hooks/useFetchTeamTableContexts';

export function CopyContextDropdown({
  tableId,
  teamId,
  copyContext,
  setCopyContext,
}: {
  tableId: string;
  teamId: string;
  copyContext: string | null;
  setCopyContext: (context: string) => void;
}) {
  const { data: contexts, isLoading: contextsIsLoading } =
    useFetchTeamTableContexts(teamId, tableId);

  if (contextsIsLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <Box marginBottom="1rem">
      <FormLabel htmlFor="select">
        Kopier svar fra eksisterende skjema
      </FormLabel>
      <FormControl>
        <Select
          id="select"
          placeholder="Velg skjema"
          onChange={(e) => setCopyContext(e.target.value)}
          required
          bgColor="white"
          borderColor="gray.200"
        >
          {contexts?.map((context) => (
            <option key={context.id} value={context.id}>
              {context.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
