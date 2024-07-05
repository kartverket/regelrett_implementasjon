import { ActiveFilter, Fields, RecordType } from '../pages/TablePage';
import { AnswerType } from '../components/answer/Answer';

export const filterData = (
  data: RecordType[],
  filters: ActiveFilter[]
): RecordType[] => {
  console.log('inside data', data);
  if (!filters.length || !data.length) return data;

  console.log('after first return');

  return filters.reduce((filteredData, filter) => {
    const fieldName = filter.filterName as keyof Fields;

    if (!fieldName || !(fieldName in data[0].fields)) {
      console.error(`Invalid filter field name: ${filter.filterName}`);
      return filteredData;
    }

    return filteredData.filter((record: RecordType) => {
      const recordField = record.fields[fieldName];
      if (typeof recordField === 'string')
        return recordField === filter.filterValue;
      if (typeof recordField === 'number')
        return recordField.toString() === filter.filterValue;
      if (Array.isArray(recordField))
        return recordField.includes(filter.filterValue);
      return false;
    });
  }, data);
};

export const updateToCombinedData = (
  answers: AnswerType[],
  data: RecordType[],
  comments?: any[]
): RecordType[] => {
  return data.map((item: RecordType) => {
    const answersMatch = answers?.find(
      (answer: AnswerType) => answer.questionId === item.fields.ID
    );
    const commentsMatch = comments?.find(
      (comment: any) => comment.questionId === item.fields.ID
    );
    const combinedData = {
      ...item,
      fields: {
        ...item.fields,
        ...answersMatch,
        ...commentsMatch,
        Status: answersMatch?.Svar ? 'Utfylt' : 'Ikke utfylt',
      },
    };
    return combinedData;
  });
};
