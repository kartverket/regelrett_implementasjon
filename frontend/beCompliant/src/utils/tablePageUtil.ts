import { Question } from '../api/types';
import {
  ActiveFilter,
  AnswerType,
  Comment,
  RecordType,
} from '../types/tableTypes';

export const filterData = (
  data: Question[],
  filters: ActiveFilter[]
): Question[] => {
  if (!filters.length || !data.length) return data;
  return filters.reduce((filteredData, filter) => {
    const fieldName = filter.filterName;
    const filterValue = filter.filterValue?.toLowerCase();

    if (!fieldName) {
      console.error(`Invalid filter field name: ${filter.filterName}`);
      return filteredData;
    }

    return filteredData.filter((record: Question) => {
      if (fieldName === 'Svar') {
        const lastAnswer = record.answers.at(-1)?.answer;
        return lastAnswer?.toLowerCase() === filterValue;
      }

      if (fieldName === 'Status') {
        const lastAnswerExists = record.answers.at(-1) != null;

        if (filterValue === 'utfylt') {
          return lastAnswerExists;
        } else if (filterValue === 'ikke utfylt') {
          return !lastAnswerExists;
        } else {
          return false;
        }
      }

      const recordField = record.metadata.optionalFields?.find(
        (field) => field.key === fieldName
      )?.value[0];
      if (typeof recordField === 'string')
        return recordField === filter.filterValue;
      if (typeof recordField === 'number')
        return recordField === filter.filterValue;
      return false;
    });
  }, data);
};

export const updateToCombinedData = (
  answers: AnswerType[],
  data: RecordType[],
  comments: Comment[] = []
): RecordType[] => {
  return data.map((item: RecordType) => {
    const answersMatch = answers?.find(
      (answer: AnswerType) => answer.questionId === item.fields.ID
    );
    const commentsMatch = comments.find(
      (comment: Comment) => comment.questionId === item.fields.ID
    );
    return {
      ...item,
      fields: {
        ...item.fields,
        ...commentsMatch,
        ...answersMatch,
        Status: answersMatch?.Svar ? 'Utfylt' : 'Ikke utfylt',
      },
    };
  });
};
