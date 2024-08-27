// Query Keys / Individual paths
const PATH_ANSWERS = '/answers';
const PATH_ANSWER = '/answer';
const PATH_COMMENTS = '/comments';
const PATH_TABLE = '/table';
const PATH_LOGIN = '/login';
const PATH_AUTH_STATUS = '/auth-status';
const PATH_USERINFO = '/userinfo';

// Base URLs

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;
// API Endpoints
const API_URL_ANSWERS = `${API_URL_BASE}${PATH_ANSWERS}`;
const API_URL_ANSWER = `${API_URL_BASE}${PATH_ANSWER}`;
const API_URL_COMMENTS = `${API_URL_BASE}${PATH_COMMENTS}`;
export const API_URL_LOGIN = `${API_URL_BASE}${PATH_LOGIN}`;
export const API_URL_AUTH_STATUS = `${API_URL_BASE}${PATH_AUTH_STATUS}`;
export const API_URL_USERINFO = `${API_URL_BASE}${PATH_USERINFO}`;

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
  userinfo: {
    queryKey: [PATH_USERINFO],
    url: API_URL_USERINFO,
  },
} as const;
