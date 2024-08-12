import {
  ActiveFilter,
  AnswerType,
  Comment,
  Fields,
  RecordType,
} from '../types/tableTypes';

export const filterData = (
  data: RecordType[],
  filters: ActiveFilter[]
): RecordType[] => {
  if (!filters.length || !data.length) return data;
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
