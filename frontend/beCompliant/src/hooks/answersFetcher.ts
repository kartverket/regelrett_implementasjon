import { useEffect, useState } from 'react';
import { AnswerType } from '../components/answer/Answer';

export const useAnswersFetcher = (
  fetchNewAnswers: any,
  setFetchNewAnswers: any,
  team?: string
) => {
  const [answers, setAnswers] = useState<AnswerType[]>();
  const [error, setError] = useState<Error>();
  const [loading, setLoading] = useState<boolean>(false);
  const URL = team
    ? `http://localhost:8080/answers/${team}`
    : 'http://localhost:8080/answers';

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

    if (fetchNewAnswers) fetcher();
    setFetchNewAnswers(false);
  }, [fetchNewAnswers]);
  return { answers, error, loading };
};
