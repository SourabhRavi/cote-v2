import { api } from "@/lib/axios.ts";
import type { Message } from "@/types/message.types.ts";

export const getMessages = async (channelId: string): Promise<Message[]> => {
  const response = await api.get(`/messages?channelId=${channelId}`);

  return response.data.data;
};

export const sendMessage = async (channelId: string, content: string) => {
  const response = await api.post(`/messages`, {
    channelId,
    content,
  });

  return response.data.data;
};
