import { Icon, Input, InputGroup, InputLeftElement } from '@kvib/react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
};

export function CardListSearch({ value, setValue }: Props) {
  const [searchTerm, setSearchTerm] = useState(value);

  const debouncedValue = useDebounce(searchTerm, 200);
  useEffect(() => {
    setValue(debouncedValue);
  }, [debouncedValue]);

  return (
    <InputGroup>
      <InputLeftElement>
        <Icon icon="search" size={24} />
      </InputLeftElement>
      <Input
        size="lg"
        value={searchTerm ?? ''}
        placeholder="Søk her..."
        aria-label="Søk i liste"
        type="search"
        onChange={(event) => setSearchTerm(event.target.value)}
      />
    </InputGroup>
  );
}
