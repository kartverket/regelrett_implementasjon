import { useSearchParams } from 'react-router';
import { useSessionStorageState } from './useStorageState';
import { useEffect, useMemo } from 'react';

type StoredRedirect = {
  url: string;
  title: string;
};

export function useStoredRedirect() {
  const [search] = useSearchParams();
  const redirectBackUrl = search.get('redirectBackUrl');
  const redirectBackTitle = search.get('redirectBackTitle');

  const redirectBack = useMemo(
    () =>
      redirectBackUrl
        ? {
            url: redirectBackUrl,
            title: redirectBackTitle ?? new URL(redirectBackUrl).hostname,
          }
        : null,
    [redirectBackUrl, redirectBackTitle]
  );

  const [storedRedirect, setStoredRedirect] =
    useSessionStorageState<StoredRedirect | null>('redirectBack', redirectBack);

  useEffect(() => {
    if (redirectBack) {
      setStoredRedirect(redirectBack);
    }
  }, [setStoredRedirect, redirectBack]);

  return storedRedirect;
}
