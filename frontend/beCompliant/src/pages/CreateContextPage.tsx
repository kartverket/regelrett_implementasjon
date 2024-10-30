import { useSearchParams } from 'react-router-dom';
import { LockedCreateContextPage } from './LockedCreateContextPage';
import { UnlockedCreateContextPage } from './UnlockedCreateContextPage';

export const CreateContextPage = () => {
  const [search] = useSearchParams();
  const locked = search.get('locked') === 'true';

  return locked ? <LockedCreateContextPage /> : <UnlockedCreateContextPage />;
};
