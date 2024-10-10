import { describe, expect, it } from 'vitest';
import { Answer, AnswerType, Comment, Table } from '../api/types';
import { groupByField, mapTableDataRecords } from './mapperUtil';

describe(mapTableDataRecords.name, () => {
  it('should map table data records with associated comments and answers', () => {
    const tableData: Table = {
      id: 'table1',
      name: 'Sample Table',
      columns: [],
      records: [
        {
          id: 'q1',
          question: 'What is your favorite color?',
          recordId: 'ar-22',
          answers: [],
          comments: [],
          metadata: {
            answerMetadata: {
              type: AnswerType.SELECT_SINGLE,
              options: ['Red', 'Blue', 'Green'],
            },
            optionalFields: null,
          },
          updated: undefined,
        },
        {
          id: 'q2',
          question: 'What is your favorite food?',
          recordId: 'ar-23',
          answers: [],
          comments: [],
          metadata: {
            answerMetadata: {
              type: AnswerType.TEXT_SINGLE_LINE,
              options: null,
            },
            optionalFields: null,
          },
          updated: undefined,
        },
      ],
    };

    const commentData: Comment[] = [
      {
        actor: 'user1',
        comment: 'I like blue',
        questionId: 'q1',
        recordId: 'r1',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
      {
        actor: 'user2',
        comment: 'Pizza is the best',
        questionId: 'q2',
        recordId: 'r2',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
    ];

    const answerData: Answer[] = [
      {
        actor: 'user1',
        answer: 'Blue',
        quesiton: 'What is your favorite color?',
        questionId: 'q1',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
      {
        actor: 'user2',
        answer: 'Pizza',
        quesiton: 'What is your favorite food?',
        questionId: 'q2',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
    ];

    const result = mapTableDataRecords(tableData, commentData, answerData);

    expect(result).toEqual([
      {
        id: 'q1',
        question: 'What is your favorite color?',
        recordId: 'ar-22',
        answers: [
          {
            actor: 'user1',
            answer: 'Blue',
            quesiton: 'What is your favorite color?',
            questionId: 'q1',
            team: 'team1',
            functionId: null,
            updated: expect.any(Date),
          },
        ],
        comments: [
          {
            actor: 'user1',
            comment: 'I like blue',
            questionId: 'q1',
            recordId: 'r1',
            team: 'team1',
            functionId: null,
            updated: expect.any(Date),
          },
        ],
        metadata: {
          answerMetadata: {
            type: AnswerType.SELECT_SINGLE,
            options: ['Red', 'Blue', 'Green'],
          },
          optionalFields: null,
        },
        updated: undefined,
      },
      {
        id: 'q2',
        question: 'What is your favorite food?',
        recordId: 'ar-23',
        answers: [
          {
            actor: 'user2',
            answer: 'Pizza',
            quesiton: 'What is your favorite food?',
            questionId: 'q2',
            team: 'team1',
            functionId: null,
            updated: expect.any(Date),
          },
        ],
        comments: [
          {
            actor: 'user2',
            comment: 'Pizza is the best',
            questionId: 'q2',
            recordId: 'r2',
            team: 'team1',
            functionId: null,
            updated: expect.any(Date),
          },
        ],
        metadata: {
          answerMetadata: {
            type: AnswerType.TEXT_SINGLE_LINE,
            options: null,
          },
          optionalFields: null,
        },
        updated: undefined,
      },
    ]);
  });

  it('should return an empty array for comments and answers if none match', () => {
    const tableData: Table = {
      id: 'table1',
      name: 'Sample Table',
      columns: [],
      records: [
        {
          id: 'q1',
          question: 'What is your favorite color?',
          recordId: 'ar-22',
          answers: [],
          comments: [],
          metadata: {
            answerMetadata: {
              type: AnswerType.SELECT_SINGLE,
              options: ['Red', 'Blue', 'Green'],
            },
            optionalFields: null,
          },
          updated: undefined,
        },
      ],
    };

    const commentData: Comment[] = [];
    const answerData: Answer[] = [];

    const result = mapTableDataRecords(tableData, commentData, answerData);

    expect(result).toEqual([
      {
        id: 'q1',
        question: 'What is your favorite color?',
        recordId: 'ar-22',
        answers: [],
        comments: [],
        metadata: {
          answerMetadata: {
            type: AnswerType.SELECT_SINGLE,
            options: ['Red', 'Blue', 'Green'],
          },
          optionalFields: null,
        },
        updated: undefined,
      },
    ]);
  });
});

describe(groupByField.name, () => {
  it('should group answers by questionId', () => {
    const answerData: Answer[] = [
      {
        actor: 'user1',
        answer: 'Blue',
        quesiton: 'What is your favorite color?',
        questionId: 'q1',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
      {
        actor: 'user2',
        answer: 'Pizza',
        quesiton: 'What is your favorite food?',
        questionId: 'q2',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
      {
        actor: 'user1',
        answer: 'Red',
        quesiton: 'What is your favorite color?',
        questionId: 'q1',
        team: 'team1',
        functionId: null,
        updated: new Date(),
      },
    ];

    const result = groupByField<Answer>(answerData, 'questionId');

    expect(result).toEqual({
      q1: [
        {
          actor: 'user1',
          answer: 'Blue',
          quesiton: 'What is your favorite color?',
          questionId: 'q1',
          team: 'team1',
          functionId: null,
          updated: expect.any(Date),
        },
        {
          actor: 'user1',
          answer: 'Red',
          quesiton: 'What is your favorite color?',
          questionId: 'q1',
          team: 'team1',
          functionId: null,
          updated: expect.any(Date),
        },
      ],
      q2: [
        {
          actor: 'user2',
          answer: 'Pizza',
          quesiton: 'What is your favorite food?',
          questionId: 'q2',
          team: 'team1',
          functionId: null,
          updated: expect.any(Date),
        },
      ],
    });
  });

  it('should return an empty object when answerData is empty', () => {
    const answerData: Answer[] = [];

    const result = groupByField<Answer>(answerData, 'questionId');

    expect(result).toEqual({});
  });

  it('should group comments by actor');

  const commentData: Comment[] = [
    {
      actor: 'user1',
      comment: 'I like blue',
      questionId: 'q1',
      recordId: 'r1',
      team: 'team1',
      functionId: null,
      updated: new Date(),
    },
    {
      actor: 'user2',
      comment: 'Pizza is the best',
      questionId: 'q2',
      recordId: 'r2',
      team: 'team1',
      functionId: null,
      updated: new Date(),
    },
    {
      actor: 'user1',
      comment: 'I also like red',
      questionId: 'q1',
      recordId: 'r1',
      team: 'team1',
      functionId: null,
      updated: new Date(),
    },
  ];

  const result = groupByField<Comment>(commentData, 'actor');
  console.log('result', result);

  expect(result).toEqual({
    user1: [
      {
        actor: 'user1',
        comment: 'I like blue',
        questionId: 'q1',
        recordId: 'r1',
        team: 'team1',
        functionId: null,
        updated: expect.any(Date),
      },
      {
        actor: 'user1',
        comment: 'I also like red',
        questionId: 'q1',
        recordId: 'r1',
        team: 'team1',
        functionId: null,
        updated: expect.any(Date),
      },
    ],
    user2: [
      {
        actor: 'user2',
        comment: 'Pizza is the best',
        questionId: 'q2',
        recordId: 'r2',
        team: 'team1',
        functionId: null,
        updated: expect.any(Date),
      },
    ],
  });
});
