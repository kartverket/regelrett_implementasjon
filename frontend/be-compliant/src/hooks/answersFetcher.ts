import { useEffect, useState } from 'react';

export const useAnswersFetcher = (
  fetchNewAnswers: any,
  setFetchNewAnswers: any,
  team?: string
) => {
  const [answers, setAnswers] = useState<any>();
  const [error, setError] = useState<Error>();
  const URL = team
    ? `http://localhost:8080/answers/${team}`
    : 'http://localhost:8080/answers';

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch(URL);
        const answersResponse = await response?.json();
        setAnswers(answersResponse);
      } catch (error) {
        setError(error as Error);
      }
    };

    if (fetchNewAnswers) fetcher();
    setFetchNewAnswers(false);
  }, [fetchNewAnswers]);
  return { answers, error };
};
