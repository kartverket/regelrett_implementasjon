import { useEffect, useState } from "react";

export const useAnswersFetcher = () => {
  const [answers, setAnswers] = useState<any>();
  const [error, setError] = useState<Error>();
  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch("http://localhost:8080/answers");
        const answersResponse = await response?.json();
        setAnswers(answersResponse);
      } catch (error) {
        setError(error as Error);
      }
    };

    fetcher();
  }, []);
  return { answers, error };
};
