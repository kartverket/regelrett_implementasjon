import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Form } from '../api/types';

export function useFetchForms() {
  const queryKeys = apiConfig.forms.queryKey();
  const url = apiConfig.forms.url();

  return useQuery({
    queryKey: queryKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
    queryFn: () =>
      axiosFetch<Form[]>({ url: url }).then((response) => response.data),
    select: formatFormData,
  });
}

function formatFormData(data: Form[]) {
  return data.map(formatFormatData);
}

function formatFormatData(data: Form) {
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
