import { api } from "@/lib/axios.ts";
import type { UnreadCount } from "@/types/unread-count.types.ts";

export type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  userEmail: string;
  status: "invited" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
  workspace: {
    id: string;
    name: string;
  };
};

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");
  return response.data.data;
};

export const getWorkspaceUnreadCounts = async (workspaceId: string): Promise<UnreadCount[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/unread`);
  return response.data.data;
};

export const createWorkspaceInvitation = async ({
  workspaceId,
  userEmail,
}: {
  workspaceId: string;
  userEmail: string;
}) => {
  console.log("workspaceId:", workspaceId);

  const response = await api.post(`/workspaces/${workspaceId}/invitations`, { userEmail });

  return response.data.data;
};

export const getWorkspaceInvitations = async (): Promise<WorkspaceInvitation[]> => {
  const response = await api.get("/workspaces/invitations");
  return response.data.data;
};

export const acceptWorkspaceInvitation = async (
  invitationId: string,
): Promise<{ workspaceId: string }> => {
  const response = await api.post(`/workspaces/invitations/${invitationId}/accept`);

  return response.data.data;
};

export const declineWorkspaceInvitation = async (invitationId: string) => {
  const response = await api.post(`/workspaces/invitations/${invitationId}/decline`);

  return response.data;
};
