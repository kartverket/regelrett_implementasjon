import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Table } from '../api/types';

export function useFetchTables() {
  const queryKeys = apiConfig.forms.queryKey();
  const url = apiConfig.forms.url();

  return useQuery({
    queryKey: queryKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
    queryFn: () =>
      axiosFetch<Table[]>({ url: url }).then((response) => response.data),
    select: formatTablesData,
  });
}

function formatTablesData(data: Table[]) {
  return data.map(formatTableData);
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
