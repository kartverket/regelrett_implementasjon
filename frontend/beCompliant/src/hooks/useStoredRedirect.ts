import { useSearchParams } from 'react-router-dom';
import { useSessionStorageState } from './useStorageState';

type StoredRedirect = {
  url: string;
  title: string;
};

export function useStoredRedirect() {
  const [search] = useSearchParams();
  const redirectBackUrl = search.get('redirectBackUrl');
  const redirectBackTitle = search.get('redirectBackTitle');

  const redirectBack = redirectBackUrl
    ? {
        url: redirectBackUrl,
        title: redirectBackTitle ?? new URL(redirectBackUrl).hostname,
      }
    : null;

  const [storedRedirect] = useSessionStorageState<StoredRedirect | null>(
    'redirectBack',
    redirectBack
  );

  return storedRedirect;
}
