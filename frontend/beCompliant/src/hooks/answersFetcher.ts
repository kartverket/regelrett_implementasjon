import { useEffect, useState } from 'react';
import { AnswerType } from '../components/answer/Answer';
import useBackendUrl from './backendUrl';

export const useAnswersFetcher = (team?: string) => {
  const [answers, setAnswers] = useState<AnswerType[]>();
  const [fetchAnswers, setFetchAnswers] = useState(false);
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);
  const path = team ? `/answers/${team}` : '/answers';
  const URL = useBackendUrl(path);

  useEffect(() => {
    const fetcher = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL);
        const answersResponse = await response?.json();
        setAnswers(answersResponse);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    if (fetchAnswers) fetcher();
    setFetchAnswers(false);
  }, [fetchAnswers]);
  return { answers, error, loading, setFetchAnswers };
};
