import { api } from "@/lib/axios.ts";

export const getChannels = async (workspaceId: string) => {
  const response = await api.get(`/channels?workspaceId=${workspaceId}`);

  return response.data.data;
};

export const getChannel = async (channelId: string) => {
  const response = await api.get(`/channels/${channelId}`);

  return response.data.data;
};

export const getUnreadCount = async (channelId: string) => {
  const response = await api.get(`/channels/${channelId}/unread`);

  return response.data.data;
};
