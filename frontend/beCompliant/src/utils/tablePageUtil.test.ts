import { describe, expect, it } from 'vitest';
import { AnswerType, OptionalFieldType, Question } from '../api/types';
import { ActiveFilter } from '../types/tableTypes';
import { filterData } from './tablePageUtil';

// Sample test data
const sampleQuestions: Question[] = [
  {
    id: 'q1',
    question: 'What is your favorite color?',
    answers: [
      {
        actor: 'user1',
        Svar: 'Blue',
        quesiton: 'spørsmål 1',
        questionId: 'ar-001',
        team: 'team 1',
        updated: new Date(),
      },
    ],
    comments: [],
    metadata: {
      optionalFields: [
        {
          key: 'Color',
          value: ['Blue'],
          type: OptionalFieldType.OPTION_SINGLE,
          options: null,
        },
      ],
      answerMetadata: { type: AnswerType.SELECT_SINGLE, options: null },
    },
    updated: '',
  },
  {
    id: 'q2',
    question: 'What is your favorite animal?',
    answers: [],
    comments: [],
    metadata: {
      optionalFields: [
        {
          key: 'Animal',
          value: ['Cat'],
          type: OptionalFieldType.TEXT,
          options: null,
        },
      ],
      answerMetadata: { type: AnswerType.SELECT_SINGLE, options: null },
    },
    updated: '',
  },
  {
    id: 'q3',
    question: 'What is your favorite color?',
    answers: [
      {
        actor: 'user1',
        Svar: 'Green',
        quesiton: 'spørsmål 1',
        questionId: 'ar-001',
        team: 'team 1',
        updated: new Date(),
      },
    ],
    comments: [],
    metadata: {
      optionalFields: [
        {
          key: 'Color',
          value: ['Blue'],
          type: OptionalFieldType.OPTION_SINGLE,
          options: null,
        },
      ],
      answerMetadata: { type: AnswerType.SELECT_SINGLE, options: null },
    },
    updated: '',
  },
];

describe('filterData', () => {
  it('returns the original data when no filters are provided', () => {
    const result = filterData(sampleQuestions, []);
    expect(result).toEqual(sampleQuestions);
  });

  it('filters questions based on the Svar field', () => {
    const filters: ActiveFilter[] = [
      { filterName: 'Svar', filterValue: 'Blue' },
    ];
    const result = filterData(sampleQuestions, filters);
    expect(result).toEqual([sampleQuestions[0]]);
  });

  it('filters questions based on the Status field', () => {
    const filtersFilled: ActiveFilter[] = [
      { filterName: 'Status', filterValue: 'utfylt' },
    ];
    const filtersNotFilled: ActiveFilter[] = [
      { filterName: 'Status', filterValue: 'ikke utfylt' },
    ];

    const resultFilled = filterData(sampleQuestions, filtersFilled);
    const resultNotFilled = filterData(sampleQuestions, filtersNotFilled);

    expect(resultFilled).toEqual([sampleQuestions[0], sampleQuestions[2]]);
    expect(resultNotFilled).toEqual([sampleQuestions[1]]);
  });

  it('filters questions based on optional fields', () => {
    const filters: ActiveFilter[] = [
      { filterName: 'Color', filterValue: 'Blue' },
    ];
    const result = filterData(sampleQuestions, filters);
    expect(result).toEqual([sampleQuestions[0], sampleQuestions[2]]);
  });

  it('returns an empty array when no matches are found', () => {
    const filters: ActiveFilter[] = [
      { filterName: 'Svar', filterValue: 'Red' },
    ];
    const result = filterData(sampleQuestions, filters);
    expect(result).toEqual([]);
  });
});
