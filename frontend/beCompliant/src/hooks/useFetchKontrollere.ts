import { apiConfig } from '../api/apiConfig';
import { useQuery } from '@tanstack/react-query/build/modern';
import { axiosFetch } from '../api/Fetch';
import { RecordType, TableMetaData } from '../types/tableTypes';

export type KontrollereData = {
  metodeverkData: {
    records: RecordType[];
  };
  metaData: {
    tables: TableMetaData[];
  };
};
export const useFetchKontrollere = (team?: string) => {
  const queryKeys = apiConfig.kontrollere.queryKey(team);
  const url = apiConfig.kontrollere.url(team);

  return useQuery({
    queryKey: queryKeys,
    queryFn: () => axiosFetch<KontrollereData>({ url: url }),
    enabled: !!team,
  });
};
