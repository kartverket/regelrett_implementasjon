import { Tag } from '@kvib/react';

interface Props {
  value: string;
}

const Priority = ({ value }: Props) => {
  const priority = value.toLowerCase();
  switch (true) {
    case priority.includes('må'):
      return (
        <Tag colorScheme="red" variant="solid">
          {value}
        </Tag>
      );
    case priority.includes('bør'):
      return (
        <Tag colorScheme="red" variant="subtle">
          {value}
        </Tag>
      );
    case priority.includes('kan'):
      return (
        <Tag colorScheme="green" variant="solid">
          {value}
        </Tag>
      );
  }
  return <Tag>{value}</Tag>;
};

export default Priority;
