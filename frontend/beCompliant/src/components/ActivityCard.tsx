import { Card, CardBody, CardHeader, Flex, Heading } from '@kvib/react';
import { Answer } from './answer/Answer';
import { Choice, RecordType } from '../types/tableTypes';

type Props = {
  record: RecordType;
  choices: Choice[];
  team?: string;
};

export const ActivityCard = ({ record, choices, team }: Props) => {
  return (
    <Card size="lg" padding="24px">
      <CardHeader padding="0" marginBottom="16px">
        <Heading size="md">{record.fields.Kortnavn}</Heading>
      </CardHeader>
      <CardBody padding="0">
        <Flex gap="16px" justifyContent="space-between">
          {record.fields.Aktivitet}
          <Flex direction="column">
            <Answer
              choices={choices}
              answer={record.fields.Svar ? record.fields.Svar : ''}
              record={record}
              team={team}
              key={record.fields.ID}
            />
          </Flex>
        </Flex>
      </CardBody>
    </Card>
  );
};
