import { Question } from '../api/types';
import { ActiveFilter } from '../types/tableTypes';

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
        const lastAnswer = Array.isArray(record.answers)
          ? record.answers.at(-1)?.answer
          : undefined;
        return lastAnswer?.toLowerCase() === filterValue;
      }

      if (fieldName === 'Status') {
        const lastAnswerExists = Array.isArray(record.answers)
          ? record.answers.at(-1) != null
          : false;

        if (filterValue === 'utfylt') {
          return lastAnswerExists;
        } else if (filterValue === 'ikke utfylt') {
          return !lastAnswerExists;
        } else {
          return false;
        }
      }

      const values = record.metadata.optionalFields?.find(
        (field) => field.key === fieldName
      )?.value;

      if (!values) return false;

      return values.some((value) => {
        if (
          typeof filter.filterValue === 'string' &&
          typeof value === 'string'
        ) {
          return value === filter.filterValue;
        }
        if (
          typeof filter.filterValue === 'number' &&
          typeof value === 'number'
        ) {
          return value === filter.filterValue;
        }
        return false;
      });
    });
  }, data);
};
