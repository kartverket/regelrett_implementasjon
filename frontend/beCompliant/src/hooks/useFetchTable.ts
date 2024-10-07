import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Table } from '../api/types';

export function useFetchTable(tableId: string, team?: string) {
  const queryKeys = team
    ? apiConfig.table.withTeam.queryKey(team)
    : apiConfig.table.queryKey();
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
    select: formatTableData,
  });
}

function formatTableData(data: Table) {
  return {
    ...data,
    records: data.records.map((record) => {
      return {
        ...record,
        updated: record.updated ? new Date(record.updated) : undefined,
      };
    }),
  };
}
