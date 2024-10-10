import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswersForQuestion(
  team?: string,
  functionId?: number,
  recordId?: string
) {
  return useQuery({
    queryKey: apiConfig.answersForQuestion.queryKey(team, functionId, recordId),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answersForQuestion.url(team, functionId, recordId),
      }).then((response) => response.data),
    enabled: recordId !== undefined,
    select: formatAnswerData,
  });
}

function formatAnswerData(answers: Answer[]) {
  return answers.map((answer: Answer) => {
    return {
      ...answer,
      updated: new Date(answer.updated),
    };
  });
}
