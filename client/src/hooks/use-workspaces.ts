import {
  acceptWorkspaceInvitation,
  createWorkspace,
  createWorkspaceInvitation,
  declineWorkspaceInvitation,
  getWorkspaceInvitations,
  getWorkspaceUnreadCounts,
  getWorkspaces,
} from "@/services/workspace.service.ts";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workspaceName }: { workspaceName: string }) =>
      createWorkspace({
        workspaceName,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
};

export const useWorkspacesUnreadCounts = (workspaceId: string) => {
  return useQuery({
    queryKey: ["unread-counts", workspaceId],
    queryFn: () => getWorkspaceUnreadCounts(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useCreateWorkspaceInvitation = () => {
  return useMutation({
    mutationFn: createWorkspaceInvitation,
  });
};

export const useWorkspaceInvitations = () => {
  return useQuery({
    queryKey: ["workspace-invitations"],
    queryFn: getWorkspaceInvitations,
    retry: false,
  });
};

export const useAcceptWorkspaceInvitation = () => {
  return useMutation({
    mutationFn: acceptWorkspaceInvitation,
  });
};

export const useDeclineWorkspaceInvitation = () => {
  return useMutation({
    mutationFn: declineWorkspaceInvitation,
  });
};
