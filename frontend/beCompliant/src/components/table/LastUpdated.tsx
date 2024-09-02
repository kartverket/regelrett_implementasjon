import { Stack, Text } from '@kvib/react';
import { formatDateTime } from '../../utils/formatTime';

type Props = {
  updated: Date;
};

export function LastUpdated({ updated }: Props) {
  return (
    <Stack color="gray" fontSize="xs" spacing={1} direction="row">
      <Text fontWeight="bold">Sist endret:</Text>
      <Text fontWeight="medium">{formatDateTime(updated.toString())}</Text>
    </Stack>
  );
}
