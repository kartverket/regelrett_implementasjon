import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswers(
  team?: string,
  functionId?: number,
  contextId?: string
) {
  const queryKeys = apiConfig.answers.withTeam.queryKey(
    team,
    functionId,
    contextId
  );
  const url = apiConfig.answers.withTeam.url(team, functionId, contextId);

  return useQuery({
    queryKey: queryKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
    queryFn: () =>
      axiosFetch<Answer[]>({ url: url }).then((response) => response.data),
    select: formatAnswerData,
    enabled: !!team || !!functionId || !!contextId,
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
