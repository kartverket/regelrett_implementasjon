// Query Keys / Individual paths
const PATH_USERINFO = '/userinfo';
const PATH_USERNAME = '/username';
const PATH_CONTEXTS = '/contexts';
const PATH_DUMP_CSV = '/dump-csv';

// Base URLs

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;
// API Endpoints
const API_URL_CONTEXTS = `${API_URL_BASE}${PATH_CONTEXTS}`;
const API_URL_DUMP_CSV = `${API_URL_BASE}${PATH_DUMP_CSV}`;
export const API_URL_USERINFO = `${API_URL_BASE}${PATH_USERINFO}`;

export const apiConfig = {
  userinfo: {
    queryKey: [PATH_USERINFO],
    url: API_URL_USERINFO,
  },
  username: {
    queryKey: (userId: string) => [PATH_USERNAME, userId],
    url: (userId: string) =>
      `${API_URL_BASE}${PATH_USERINFO}/${userId}${PATH_USERNAME}`,
  },
  contexts: {
    queryKey: [PATH_CONTEXTS],
    url: API_URL_CONTEXTS,
    byId: {
      queryKey: (contextId: string) => [PATH_CONTEXTS, contextId],
      url: (contextId: string) => `${API_URL_CONTEXTS}/${contextId}`,
    },
    forTeam: {
      queryKey: (teamId: string) => [PATH_CONTEXTS, teamId],
      url: (teamId: string) => `${API_URL_CONTEXTS}?teamId=${teamId}`,
    },
    forIdAndTeam: {
      queryKey: (contextId: string, teamId: string) => [
        PATH_CONTEXTS,
        contextId,
        teamId,
      ],
      url: (contextId: string) => `${API_URL_CONTEXTS}/${contextId}`,
    },
    forTeamAndForm: {
      queryKey: (teamId: string, formId: string) => [
        PATH_CONTEXTS,
        teamId,
        formId,
      ],
      url: (teamId: string, formId: string) =>
        `${API_URL_CONTEXTS}?teamId=${teamId}&formId=${formId}`,
    },
  },
  dumpCSV: {
    queryKey: [PATH_DUMP_CSV],
    url: API_URL_DUMP_CSV,
  },
} as const;
