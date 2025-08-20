import { Button } from '@/components/ui/button';
import { useAnswers } from '@/hooks/useAnswers';
import { useComments } from '@/hooks/useComments';
import { useForm } from '@/hooks/useForm';
import { mapTableDataRecords } from '@/utils/mapperUtil';
import { UseQueryResult } from '@tanstack/react-query';
import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { getSortFuncForColumn } from '../activityPage/table/TableSort';
import { Form, Question } from '@/api/types';
import { Link } from 'react-router';

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
  const answerQuery = useAnswers(contextId);
  const commentsQuery = useComments(contextId);

  if (formQuery.data && commentsQuery.data && answerQuery.data) {
    formQuery.data.records = mapTableDataRecords(
      formQuery.data,
      commentsQuery.data,
      answerQuery.data
    );
  }

  const filterstate = getFilterState(formQuery);
  console.log('filterstate', filterstate);

  const sortingState = getSortingState(formQuery);
  console.log('sortingState', sortingState);

  const disabled =
    formQuery.isPending ||
    answerQuery.isPending ||
    commentsQuery.isPending ||
    formQuery.error != null ||
    answerQuery.error != null ||
    commentsQuery.error != null;

  let neighbours;
  if (!disabled)
    neighbours = getNeighbours(
      formQuery.data,
      recordId,
      sortingState,
      filterstate
    );

  return (
    <div className="flex">
      {neighbours?.prev != undefined ? (
        <Link relative="path" to={`../${neighbours.prev.recordId}`}>
          <Button>{neighbours.prev.id}</Button>
        </Link>
      ) : (
        <Button disabled>...</Button>
      )}
      {neighbours?.next != undefined ? (
        <Link relative="path" to={`../${neighbours.next.recordId}`}>
          <Button disabled={disabled}>{neighbours.next.id}</Button>
        </Link>
      ) : (
        <Button disabled>...</Button>
      )}
    </div>
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

function getNeighbours(
  form: Form,
  recordId: string,
  sortingState: SortingState,
  filterState: ColumnFiltersState
): { prev?: Question; next?: Question } {
  let records = form.records;

  if (filterState.length > 0) {
    records = records.filter(getFilterFn(filterState));
  }

  const sortColumn = sortingState[0]?.id ?? '';
  if (sortColumn != '') {
    records.sort(sortQuestionsFn(sortColumn));
  }

  const index = records.findIndex((question) => question.recordId === recordId);

  let prev = undefined;
  if (index > 0) {
    prev = records[index - 1];
  }

  let next = undefined;
  if (index < records.length - 1) {
    next = records[index + 1];
  }

  if (sortingState[0]?.desc) return { prev: next, next: prev };

  return { prev, next };
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
