import { api } from "@/lib/axios.ts";
import type { Channel } from "@/types/channel.types.ts";

export type SearchChannel = {
  id: string;
  workspaceId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isJoined: boolean;
};

export const getChannels = async (workspaceId: string): Promise<Channel[]> => {
  const response = await api.get(`/channels?workspaceId=${workspaceId}`);

  return response.data.data;
};

export const getChannel = async (channelId: string): Promise<Channel> => {
  const response = await api.get(`/channels/${channelId}`);

  return response.data.data;
};

export const searchChannels = async (
  workspaceId: string,
  search: string,
): Promise<SearchChannel[]> => {
  const response = await api.get(
    `/channels/search?workspaceId=${workspaceId}&search=${encodeURIComponent(search)}`,
  );

  return response.data.data;
};

export const joinChannel = async (channelId: string) => {
  const response = await api.post(`/channels/${channelId}/join`);

  return response.data.data;
};

export const getUnreadCount = async (channelId: string) => {
  const response = await api.get(`/channels/${channelId}/unread`);

  return response.data.data;
};

export const createChannel = async (workspaceId: string, channelName: string): Promise<Channel> => {
  const response = await api.post(`/channels`, {
    workspaceId,
    channelName,
  });

  return response.data.data;
};
