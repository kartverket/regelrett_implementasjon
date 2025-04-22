// Query Keys / Individual paths
const PATH_USERINFO = '/userinfo';
const PATH_CONTEXTS = '/contexts';

// Base URLs

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;
// API Endpoints
const API_URL_CONTEXTS = `${API_URL_BASE}${PATH_CONTEXTS}`;
export const API_URL_USERINFO = `${API_URL_BASE}${PATH_USERINFO}`;

export const apiConfig = {
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
} as const;
