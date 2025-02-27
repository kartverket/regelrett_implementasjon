import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { AxiosError } from 'axios';
import { useToast } from '@kvib/react';
import { useUser } from './useUser';

export type Context = {
  id: string;
  name: string;
  formId: string;
  teamId: string;
};

export function useFetchTeamContexts(teamId?: string) {
  return useQuery({
    queryKey: apiConfig.contexts.forTeam.queryKey(teamId!),
    queryFn: () =>
      axiosFetch<Context[]>({
        url: apiConfig.contexts.forTeam.url(teamId!),
      }).then((response) => response.data),
    enabled: !!teamId,
  });
}

export function useContext(contextId?: string) {
  return useQuery<Context, AxiosError>({
    queryKey: apiConfig.contexts.byId.queryKey(contextId!),
    queryFn: () =>
      axiosFetch<Context>({
        url: apiConfig.contexts.byId.url(contextId!),
      }).then((response) => response.data),
    enabled: !!contextId,
  });
}

type SubmitContextRequest = {
  teamId: string;
  formId: string;
  name: string;
  copyContext: string | null;
};

export interface SubmitContextResponse {
  id: string;
  teamId: string;
  formId: string;
  name: string;
}

export function useSubmitContext() {
  const URL = apiConfig.contexts.url;
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.contexts.queryKey,
    mutationFn: (body: SubmitContextRequest) => {
      return axiosFetch<SubmitContextResponse>({
        url: URL,
        method: 'POST',
        data: body,
      });
    },
    onSuccess: async () => {
      const toastId = 'submit-context-success';
      if (!toast.isActive(toastId)) {
        toast({
          title: 'Suksess',
          description: 'Konteksten ble opprettet',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: apiConfig.contexts.queryKey,
      });
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 409) {
        const toastId = 'submit-context-conflict';
        if (!toast.isActive(toastId)) {
          toast({
            id: toastId,
            title: 'Konflikt',
            description: 'Et skjema med dette navnet eksisterer allerede.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        const toastId = 'submit-context-error';
        if (!toast.isActive(toastId)) {
          toast({
            id: toastId,
            title: 'Å nei!',
            description: 'Det har skjedd en feil. Prøv på nytt',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      }
    },
  });
}

export function useFetchAllContexts() {
  const { data: userinfo } = useUser();
  const teams: string[] = userinfo?.groups.map((group) => group.id) ?? [];

  return useQuery({
    queryKey: ['allContexts'],
    queryFn: async () => {
      const promises: Promise<Context[]>[] = [];
      for (const team of teams) {
        promises.push(
          axiosFetch<Context[]>({
            url: apiConfig.contexts.forTeam.url(team),
          }).then((response) => response.data)
        );
      }
      return (await Promise.all(promises)).reduce((acc, val) => {
        return acc.concat(val);
      }, []);
    },
    enabled: !!teams.length,
  });
}

export function useDeleteContext(
  contextId: string,
  teamId: string,
  onSuccess: () => void
) {
  const URL = apiConfig.contexts.byId.url(contextId);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.contexts.byId.queryKey(contextId),
    mutationFn: () => {
      return axiosFetch({
        url: URL,
        method: 'DELETE',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: apiConfig.contexts.forTeam.queryKey(teamId),
      });
      onSuccess();
    },
    onError: () => {
      const toastId = 'delete-context-error';
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: 'Å nei!',
          description: 'Det har skjedd en feil. Prøv på nytt',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
  });
}
