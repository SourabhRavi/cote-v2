import { api } from "@/lib/axios.ts";
import type { UnreadCount } from "@/types/unread-count.types.ts";

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");

  return response.data.data;
};

export const getWorkspaceUnreadCounts = async (workspaceId: string): Promise<UnreadCount[]> => {
  const response = await api.get(`/workspaces/${workspaceId}/unread`);

  return response.data.data;
};
