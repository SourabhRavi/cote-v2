import { api } from "@/lib/axios.ts";

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");

  return response.data.data;
};

export const getWorkspaceUnreadCounts = async (workspaceId: string) => {
  const response = await api.get(`/workspaces/${workspaceId}/unread`);

  return response.data.data;
};
