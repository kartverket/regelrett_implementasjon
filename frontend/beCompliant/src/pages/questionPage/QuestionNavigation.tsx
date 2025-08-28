import { Button } from '@/components/ui/button';
import { useAnswers } from '@/hooks/useAnswers';
import { useComments } from '@/hooks/useComments';
import { useForm } from '@/hooks/useForm';
import { mapTableDataRecords } from '@/utils/mapperUtil';
import { UseQueryResult } from '@tanstack/react-query';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { getSortFuncForColumn } from '../activityPage/table/TableSort';
import { Question } from '@/api/types';
import { Link } from 'react-router';
import { Spinner } from '@/components/Spinner';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function QuestionNavigation({
  formId,
  recordId,
  contextId,
}: {
  formId: string;
  recordId: string;
  contextId: string;
}) {
  const formQuery = useForm(formId);
  const allAnswersQuery = useAnswers(contextId);
  const allCommentsQuery = useComments(contextId);

  const disabled =
    formQuery.isPending ||
    allAnswersQuery.isPending ||
    allCommentsQuery.isPending ||
    formQuery.error != null ||
    allAnswersQuery.error != null ||
    allCommentsQuery.error != null;
  if (disabled) return <Spinner />;

  const filterState = getFilterState(formQuery);
  const sortingState = getSortingState(formQuery);

  let records = mapTableDataRecords(
    formQuery.data,
    allCommentsQuery.data,
    allAnswersQuery.data
  );

  if (filterState.length > 0) {
    records = records.filter(getFilterFn(filterState));
  }

  if (sortingState[0]?.id != undefined) {
    records.sort(sortQuestionsFn(sortingState[0].id));
  }

  if (sortingState[0]?.desc) {
    records.reverse;
  }

  const index = records.findIndex((question) => question.recordId === recordId);
  const prev = index > 0 ? records[index - 1] : undefined;
  const next = index < records.length - 1 ? records[index + 1] : undefined;

  return (
    <>
      <Badge variant="secondary">
        {index + 1} av {records.length}
      </Badge>
      <div className="flex fixed bottom-0 left-0 right-0 justify-between w-full">
        {prev != undefined ? (
          <Link
            className="flex font-bold"
            relative="path"
            to={`../${prev?.recordId}`}
          >
            <ArrowLeft size={'sm'} />
            FORRIGE
          </Link>
        ) : (
          <div />
        )}
        <Link relative="path" to={`../${next?.recordId}`}>
          <Button
            className="flex"
            disabled={next == undefined}
            variant="ghost"
            size="lg"
          >
            NESTE
            <ArrowRight />
          </Button>
        </Link>
      </div>
    </>
  );
}

function getSortingState(
  formQuery: UseQueryResult<{ id: string }>
): SortingState {
  if (formQuery.isPending || formQuery.error) return [];
  return JSON.parse(
    localStorage.getItem(`sortingState_${formQuery.data.id}`) || '[]'
  );
}

function getSortValue(question: Question, sortColummn: string): string {
  switch (sortColummn) {
    case 'Kommentar':
      return question.comments.at(-1)?.comment ?? '';
    case 'Svar':
      return question.answers.at(-1)?.updated?.getTime().toString() ?? '0';
    default:
      return (
        question.metadata.optionalFields
          ?.find(({ key }) => key == sortColummn)
          ?.value?.[0]?.toLowerCase() || ''
      );
  }
}

function sortQuestionsFn(columnId: string) {
  return function (a: Question, b: Question) {
    return getSortFuncForColumn(columnId)(
      getSortValue(a, columnId),
      getSortValue(b, columnId)
    );
  };
}

function getFilterState(
  formQuery: UseQueryResult<{ id: string }>
): ColumnFiltersState {
  if (formQuery.isPending || formQuery.error) return [];
  return JSON.parse(
    localStorage.getItem(`filters_${formQuery.data.id}`) || '[]'
  );
}

function getFilterFn(
  filterState: ColumnFiltersState
): (question: Question) => boolean {
  return function (question: Question): boolean {
    const map = new Map<string, boolean>();
    for (let i = 0; i < filterState.length; i++) {
      const filter = filterState[i];
      if (map.get(filter.id)) continue;

      const statusPredicate =
        filter.id == 'Status' &&
        ((filter.value == 'utfylt' && question.answers.length > 0) ||
          (filter.value == 'ikke utfylt' && question.answers.length == 0));

      const answerPredicate =
        filter.id == 'Svar' && filter.value == question.answers.at(-1)?.answer;

      map.set(
        filter.id,
        statusPredicate ||
          answerPredicate ||
          question.metadata.optionalFields?.find(({ key }) => key == filter.id)
            ?.value == filter.value
      );
    }

    return map.values().every((bool) => bool == true);
  };
}
