import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { AxiosError } from 'axios';
import { useUser } from './useUser';
import { toaster } from '@kvib/react';

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

export type Context = {
  id: string;
  name: string;
  formId: string;
  teamId: string;
};

export function useTeamContexts(teamId?: string) {
  return useQuery({
    queryKey: ['contexts', teamId],
    queryFn: () =>
      axiosFetch<Context[]>({
        url: teamId ? `${API_URL_BASE}/contexts?teamId=${teamId}` : undefined,
      }).then((response) => response.data),
    enabled: !!teamId,
  });
}

export function useContext(contextId?: string) {
  return useQuery<Context, AxiosError>({
    queryKey: ['contexts', contextId],
    queryFn: () =>
      axiosFetch<Context>({
        url: contextId ? `${API_URL_BASE}/contexts/${contextId}` : undefined,
      }).then((response) => response.data),
    enabled: !!contextId,
  });
}

type SubmitContextRequest = {
  teamId: string;
  formId: string;
  name: string;
  copyContext: string | null;
  copyComments: 'yes' | 'no' | null;
};

export interface SubmitContextResponse {
  id: string;
  teamId: string;
  formId: string;
  name: string;
}
export function useSubmitContext() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SubmitContextRequest) => {
      return axiosFetch<SubmitContextResponse>({
        url: `${API_URL_BASE}/contexts`,
        method: 'POST',
        data: body,
      });
    },
    onSuccess: async () => {
      const toastId = 'submit-context-success';
      if (!toaster.isVisible(toastId)) {
        toaster.create({
          title: 'Suksess',
          description: 'Konteksten ble opprettet',
          type: 'success',
          duration: 5000,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: ['contexts'],
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        const toastId = 'submit-context-conflict';
        if (!toaster.isVisible(toastId)) {
          toaster.create({
            id: toastId,
            title: 'Konflikt',
            description: 'Et skjema med dette navnet eksisterer allerede.',
            type: 'warning',
            duration: 5000,
          });
        }
      } else {
        const toastId = 'submit-context-error';
        if (!toaster.isVisible(toastId)) {
          toaster.create({
            id: toastId,
            title: 'Å nei!',
            description: 'Det har skjedd en feil. Prøv på nytt',
            type: 'error',
            duration: 5000,
          });
        }
      }
    },
  });
}

export function useFetchAllContexts() {
  const { data: userinfo } = useUser();
  const teamIds: string[] = userinfo?.groups.map((group) => group.id) ?? [];

  return useQuery({
    queryKey: ['allContexts'],
    queryFn: async () => {
      const promises: Promise<Context[]>[] = [];
      for (const teamId of teamIds) {
        promises.push(
          axiosFetch<Context[]>({
            url: `${API_URL_BASE}/contexts?teamId=${teamId}`,
          }).then((response) => response.data)
        );
      }
      return (await Promise.all(promises)).reduce((acc, val) => {
        return acc.concat(val);
      }, []);
    },
    enabled: !!teamIds.length,
  });
}

export function useCopyContextAnswers({
  contextId,
  onError,
}: {
  contextId: string | undefined;
  onError: () => void;
}) {
  return useMutation({
    mutationFn: ({ copyContextId }: { copyContextId: string }) => {
      return axiosFetch({
        url: contextId
          ? `${API_URL_BASE}/contexts/${contextId}/answers`
          : undefined,
        method: 'PATCH',
        data: {
          copyContextId,
        },
      });
    },
    onError,
  });
}

export function useCopyContextComments({
  contextId,
  onError,
}: {
  contextId: string | undefined;
  onError: () => void;
}) {
  return useMutation({
    mutationFn: ({ copyContextId }: { copyContextId: string }) => {
      return axiosFetch({
        url: contextId
          ? `${API_URL_BASE}/contexts/${contextId}/comments`
          : undefined,
        method: 'PATCH',
        data: {
          copyContextId,
        },
      });
    },
    onError,
  });
}

export function useDeleteContext(
  contextId: string,
  teamId: string,
  onSuccess: () => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return axiosFetch({
        url: `${API_URL_BASE}/contexts/${contextId}`,
        method: 'DELETE',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['contexts', teamId],
      });
      onSuccess();
    },
    onError: () => {
      const toastId = 'delete-context-error';
      if (!toaster.isVisible(toastId)) {
        toaster.create({
          id: toastId,
          title: 'Å nei!',
          description: 'Det har skjedd en feil. Prøv på nytt',
          type: 'error',
          duration: 5000,
        });
      }
    },
  });
}

export function useChangeTeamForContext({
  onSuccess,
  contextId,
  currentTeamName,
}: {
  currentTeamName: string;
  contextId?: string;
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newTeam: string) => {
      return axiosFetch({
        url: contextId
          ? `${API_URL_BASE}/contexts/${contextId}/team`
          : undefined,
        method: 'PATCH',
        data: {
          teamName: newTeam,
        },
      });
    },
    onSuccess: async (_, newTeam) => {
      onSuccess();
      const toastId = 'change-context-team-success';
      if (!toaster.isVisible(toastId)) {
        toaster.create({
          title: 'Endringen er lagret!',
          description: `Skjemaet er nå flyttet fra teamet ${currentTeamName} til ${newTeam}.`,
          type: 'success',
          duration: 5000,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: ['contexts', contextId],
      });
    },
  });
}
