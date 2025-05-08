import { useForm } from '@/hooks/useForm';
import { useAnswers } from '@/hooks/useAnswers';
import { groupByField } from '@/utils/mapperUtil';
import { Answer } from '@/api/types';
import {
  AbsoluteCenter,
  KvibProgressCircle,
  Skeleton,
  Text,
} from '@kvib/react';

export function ProgressCircle({
  contextId,
  formId,
}: {
  contextId: string;
  formId: string;
}) {
  const { data: formData, isPending: formIsPending } = useForm(formId);

  const { data: answers, isPending: answerIsPending } = useAnswers(contextId);

  const recordsWithAnswers = formData?.records.map((question) => ({
    ...question,
    answers:
      groupByField<Answer>(answers ?? [], 'questionId')[question.id] || [],
  }));

  const numberOfAnswers = recordsWithAnswers?.reduce((count, data) => {
    if (data.answers?.[0]?.answer && data.answers.at(-1)?.answer !== '') {
      count++;
    }
    return count;
  }, 0);

  const percentageAnswered = recordsWithAnswers?.length
    ? Math.round(((numberOfAnswers ?? 0) / recordsWithAnswers.length) * 100)
    : 0;

  return (
    <Skeleton loading={formIsPending || answerIsPending}>
      <KvibProgressCircle.Root
        value={isNaN(percentageAnswered) ? 0 : percentageAnswered}
        size="xl"
        colorPalette="blue"
      >
        <KvibProgressCircle.Circle>
          <KvibProgressCircle.Track />
          <KvibProgressCircle.Range strokeLinecap="round" />
        </KvibProgressCircle.Circle>
        <AbsoluteCenter>
          <KvibProgressCircle.Label>
            <Text fontWeight="bold">
              {numberOfAnswers}/{recordsWithAnswers?.length}
            </Text>
          </KvibProgressCircle.Label>
        </AbsoluteCenter>
      </KvibProgressCircle.Root>
    </Skeleton>
  );
}
