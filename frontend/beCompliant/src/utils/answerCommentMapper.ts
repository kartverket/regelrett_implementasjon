import { Answer, Comment, Table } from '../api/types';

export const addCommentsAndAnswersToRecords = (
  tableData: Table,
  commentData: Comment[],
  answerData: Answer[]
) => {
  tableData.records = tableData.records.map((question) => ({
    ...question,
    comments: createCommentMap(commentData)[question.id] || [],
    answers: createAnswerMap(answerData)[question.id] || [],
  }));

  return tableData;
};

const createCommentMap = (commentData: Comment[]) => {
  return commentData?.reduce(
    (map, comment) => {
      if (!map[comment.questionId]) {
        map[comment.questionId] = [];
      }
      map[comment.questionId].push(comment);
      return map;
    },
    {} as { [key: string]: Comment[] }
  );
};

const createAnswerMap = (answerData: Answer[]) => {
  return answerData?.reduce(
    (map, answer) => {
      if (!map[answer.questionId]) {
        map[answer.questionId] = [];
      }
      map[answer.questionId].push(answer);
      return map;
    },
    {} as { [key: string]: Answer[] }
  );
};
