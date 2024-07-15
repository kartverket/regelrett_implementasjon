import { useEffect, useState } from 'react';

export const useLocalstorageState = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => {
    const storedValue = window.localStorage.getItem(key);

    if (storedValue) {
      return JSON.parse(storedValue);
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [value, setValue]);

  return [value, setValue];
};
