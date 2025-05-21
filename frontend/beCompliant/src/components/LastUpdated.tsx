import { Tooltip, Icon } from '@kvib/react';
import { Flex, Text } from '@radix-ui/themes';
import { formatDateTime, isOlderThan } from '../utils/formatTime';
import { Button } from './ui/button';

type Props = {
  updated?: Date;
  submitAnswer?: (newAnswer: string, unit?: string) => void;
  value?: string | undefined;
  unitAnswer?: string;
  answerExpiry?: number | null;
  isComment?: boolean;
};

export function LastUpdated({
  updated,
  submitAnswer,
  value,
  unitAnswer,
  answerExpiry,
  isComment,
}: Props) {
  if (!updated) return null;

  return (
    <div className="flex flex-row gap-1.5 content-center justify-between">
      <div className="flex flex-col">
        <Text className="block text-muted-foreground text-[0.625rem]">
          Sist endret
        </Text>
        {!isComment && isOlderThan(updated, answerExpiry) && (
          <Tooltip
            content="Svaret må oppdateres"
            aria-label="Svaret må oppdateres"
          >
            <Icon icon="warning" color="red" size={24} />
          </Tooltip>
        )}
        <Text
          className="block text-wrap text-foreground text-xs"
          color={
            isOlderThan(updated, answerExpiry) && !isComment ? 'red' : 'gray'
          }
        >
          {formatDateTime(updated)}
        </Text>
      </div>
      {!isComment && submitAnswer && (
        <Button
          aria-label="Forny svaret"
          color="black"
          variant="link"
          size="sm"
          onClick={() => {
            submitAnswer(value ?? '', unitAnswer);
          }}
          className="p-0"
        >
          Forny svar
        </Button>
      )}
    </div>
  );
}
