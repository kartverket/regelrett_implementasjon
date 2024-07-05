import { useEffect, useState } from 'react';
import useBackendUrl from './backendUrl';

export const useCommentsFetcher = (team?: string) => {
  const [comments, setComments] = useState<any>();
  const [error, setError] = useState<Error>();
  const path = team ? `/comments/${team}` : '/comments';
  const URL = useBackendUrl(path);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const response = await fetch(URL);
        const commentsResponse = await response?.json();
        setComments(commentsResponse);
      } catch (error) {
        setError(error as Error);
      }
    };

    fetcher();
  }, []);
  return { comments, error };
};
