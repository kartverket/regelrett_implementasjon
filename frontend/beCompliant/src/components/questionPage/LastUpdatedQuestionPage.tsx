import { Text } from '@kvib/react';
import { formatDateTime } from '../../utils/formatTime';

export function LastUpdatedQuestionPage({
  lastUpdated,
}: {
  lastUpdated?: Date;
}) {
  if (!lastUpdated) return null;
  return (
    <Text fontSize="md" fontWeight="semibold">
      {'Svar sist endret ' + formatDateTime(lastUpdated)}
    </Text>
  );
}
