import { getMessages, sendMessage, updateMessage } from "@/services/message.service.ts";
import { useMutation, useInfiniteQuery } from "@tanstack/react-query";

export const useGetMessages = (channelId: string) => {
  // normal usage:
  // return useQuery({
  //   queryKey: ["get-messages", channelId],
  //   queryFn: () => getMessages(channelId),
  //   enabled: !!channelId,
  // });

  return useInfiniteQuery({
    queryKey: ["get-messages", channelId],
    queryFn: ({ pageParam }) => getMessages(channelId, pageParam || undefined),
    initialPageParam: "",
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor : undefined),
    enabled: !!channelId,
  });
};

export const useSendMessage = () => {
  return useMutation({
    mutationFn: ({ channelId, content }: { channelId: string; content: string }) =>
      sendMessage(channelId, content),
  });
};

export const useUpdateMessage = () => {
  return useMutation({
    mutationFn: ({ messageId, content }: { messageId: string; content: string }) =>
      updateMessage(messageId, content),
  });
};
