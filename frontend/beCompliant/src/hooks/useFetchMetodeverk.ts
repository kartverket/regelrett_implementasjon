import { apiConfig } from '../api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { RecordType } from '../pages/TablePage';
import { Field, TableMetaData } from './datafetcher';

export type MetodeverkData = {
  metodeverkData: {
    records: RecordType[]
  },
  metaData: {
    tables: TableMetaData[]
  }
}
export const useFetchMetodeverk = () => {
  const queryKeys = apiConfig.metodeverk.queryKey;
  const url = apiConfig.metodeverk.url;


  return useQuery({
    queryKey: queryKeys,
    queryFn: () => {
      return axiosFetch<MetodeverkData>({ url: url }).then(response => {
        const records = response.data.metodeverkData.records;
        const tableMetaData = response.data.metaData.tables
          .filter((table: TableMetaData) => table.id === 'tblLZbUqA0XnUgC2v')[0];
        const choices = tableMetaData.fields
            .filter((field: Field) => field.name === 'Svar')[0]
            ?.options
            ?.choices
          ?? [];
        return { records: records, tableMetaData: tableMetaData, choices: choices };
      });
    },
    staleTime: 120000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
  });
};