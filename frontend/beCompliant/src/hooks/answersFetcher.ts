import { useEffect, useState } from 'react';
import { AnswerType } from '../components/answer/Answer';

export const useAnswersFetcher = (team?: string) => {
  const [answers, setAnswers] = useState<AnswerType[]>();
  const [fetchAnswers, setFetchAnswers] = useState(false);
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

    if (fetchAnswers) fetcher();
    setFetchAnswers(false);
  }, [fetchAnswers]);
  return { answers, error, loading, setFetchAnswers };
};
