// Query Keys / Individual paths
const PATH_ANSWERS = '/answers';
const PATH_ANSWER = '/answer';
const PATH_COMMENTS = '/comments';
const PATH_TABLE = '/table';

// Base URLs

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;
// API Endpoints
const API_URL_ANSWERS = `${API_URL_BASE}${PATH_ANSWERS}`;
const API_URL_ANSWER = `${API_URL_BASE}${PATH_ANSWER}`;
const API_URL_COMMENTS = `${API_URL_BASE}${PATH_COMMENTS}`;

export const apiConfig = {
  answers: {
    queryKey: [PATH_ANSWERS],
    url: API_URL_ANSWERS,
  },
  answer: {
    queryKey: [PATH_ANSWER],
    url: API_URL_ANSWER,
  },
  comments: {
    queryKey: [PATH_COMMENTS],
    url: API_URL_COMMENTS,
  },
  table: {
    queryKey: (tableId: string) => [PATH_TABLE, tableId],
    url: (tableId: string) => `${API_URL_BASE}${PATH_TABLE}/${tableId}`,
    withTeam: {
      queryKey: (tableId: string, team: string) => [PATH_TABLE, tableId, team],
      url: (tableId: string, team: string) =>
        `${API_URL_BASE}${PATH_TABLE}/${tableId}?team=${team}`,
    },
  },
} as const;
