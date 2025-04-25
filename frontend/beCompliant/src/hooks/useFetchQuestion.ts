import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { Question } from '../api/types';

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

export function useFetchQuestion(formId?: string, recordId?: string) {
  return useQuery({
    queryKey: ['forms', formId, recordId],
    queryFn: () =>
      axiosFetch<Question>({
        url:
          formId && recordId
            ? `${API_URL_BASE}/forms/${formId}/${recordId}`
            : undefined,
      }).then((response) => response.data),
    enabled: recordId !== undefined && formId !== undefined,
  });
}
