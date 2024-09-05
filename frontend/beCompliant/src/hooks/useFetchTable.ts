import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Table } from '../api/types';

export function useFetchTable(tableId: string, team?: string) {
  const queryKeys = ['fetchtable'];
  const url = team
    ? apiConfig.table.withTeam.url(tableId, team)
    : apiConfig.table.url(tableId);

  return useQuery({
    queryKey: queryKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
    queryFn: () =>
      axiosFetch<Table>({ url: url }).then((response) => response.data),
  });
}
