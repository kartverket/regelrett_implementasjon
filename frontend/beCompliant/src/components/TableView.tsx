import { Flex, Heading, Tag, TagCloseButton, TagLabel } from '@kvib/react';
import { TableComponent } from './Table';
import { useLocalstorageState } from '../hooks/useLocalstorageState';
import { RecordType, TableMetaData } from '../types/tableTypes';

type Props = {
  data: RecordType[];
  metadata: TableMetaData;
};

export const TableView = ({ data, metadata }: Props) => {
  const [columnVisibility, setColumnVisibility] = useLocalstorageState<
    Record<string, boolean>
  >('columnVisibility', {});

  const hasHiddenColumns = Object.values(columnVisibility).some(
    (value) => value === false
  );
  const unhideColumn = (name: string) => {
    setColumnVisibility((prev: Record<string, boolean>) => ({
      ...prev,
      [name]: true,
    }));
  };
  return (
    <>
      {hasHiddenColumns && (
        <Flex direction="column" gap="8px" margin="20px">
          <Heading size="xs">Skjulte kolonner</Heading>
          <Flex gap="4px">
            {Object.entries(columnVisibility)
              .filter(([_, visible]) => !visible)
              .map(([name, _]) => (
                <Tag key={name}>
                  <TagLabel>{name}</TagLabel>
                  <TagCloseButton onClick={() => unhideColumn(name)} />
                </Tag>
              ))}
          </Flex>
        </Flex>
      )}
      <TableComponent
        data={data}
        fields={metadata.fields}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
      />
    </>
  );
};
