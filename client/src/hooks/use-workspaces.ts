import {
  createWorkspaceInvitation,
  declineWorkspaceInvitation,
  getWorkspaceInvitations,
  getWorkspaceUnreadCounts,
  getWorkspaces,
  acceptWorkspaceInvitation,
} from "@/services/workspace.service.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
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
