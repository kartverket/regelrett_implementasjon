import { Stack, Text, Tooltip, Icon, Box, Button } from '@kvib/react';
import { formatDateTime } from '../../utils/formatTime';

type Props = {
  updated?: Date;
  submitAnswer?: (newAnswer: string, unit?: string) => void;
  value?: string | undefined;
  unitAnswer?: string;
  answerExpiry?: number | null;
  isComment?: boolean;
  isActivityPageView?: boolean;
};

export function LastUpdated({
  updated,
  submitAnswer,
  value,
  unitAnswer,
  answerExpiry,
  isComment,
  isActivityPageView,
}: Props) {
  if (!updated) return null;

  const isOlderThan = (updated: Date, weeks?: number | null): boolean => {
    const currentDate = new Date();
    const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
    const threshold = weeks
      ? weeks * millisecondsInAWeek
      : 30 * 24 * 60 * 60 * 1000; // Use weeks or default to 30 days
    return currentDate.getTime() - updated.getTime() > threshold;
  };

  return (
    <Stack
      color="gray"
      fontSize={isActivityPageView ? 'xs' : 'md'}
      spacing={1}
      direction="row"
      alignItems="center"
    >
      <Text
        fontWeight={isActivityPageView ? 'bold' : 'semibold'}
        color={isActivityPageView ? 'gray' : 'black'}
      >
        Sist endret:
      </Text>
      {!isComment && isOlderThan(updated, answerExpiry) && (
        <Tooltip label="Svaret må oppdateres" aria-label="Svaret må oppdateres">
          <Box as="span">
            <Icon icon="warning" color="red" size={24} />
          </Box>
        </Tooltip>
      )}
      <Text
        fontWeight={isActivityPageView ? 'medium' : 'semibold'}
        color={
          isOlderThan(updated, answerExpiry) && !isComment
            ? 'red'
            : isActivityPageView
              ? 'gray'
              : 'black'
        }
      >
        {formatDateTime(updated)}
      </Text>
      {!isComment && submitAnswer && (
        <Button
          aria-label="Forny svaret"
          rightIcon="autorenew"
          color="black"
          variant={'tertiary'}
          size="xs"
          onClick={() => {
            submitAnswer(value ?? '', unitAnswer);
          }}
        >
          Forny svar
        </Button>
      )}
    </Stack>
  );
}
