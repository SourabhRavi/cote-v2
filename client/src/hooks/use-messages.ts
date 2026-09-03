import { getMessages, sendMessage } from "@/services/message.service.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetMessages = (channelId: string) => {
  return useQuery({
    queryKey: ["get-messages", channelId],
    queryFn: () => getMessages(channelId),
    enabled: !!channelId,
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({ channelId, content }: { channelId: string; content: string }) =>
      sendMessage(channelId, content),
  });
};
