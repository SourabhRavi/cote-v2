import {
  getChannel,
  getChannels,
  getUnreadCount,
  joinChannel,
  searchChannels,
} from "@/services/channel.service.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useChannels = (workspaceId: string) => {
  return useQuery({
    queryKey: ["channels", workspaceId],
    queryFn: () => getChannels(workspaceId),
    enabled: !!workspaceId,
  });
};

export const useChannel = (channelId: string) => {
  return useQuery({
    queryKey: ["channels", channelId],
    queryFn: () => getChannel(channelId),
    enabled: !!channelId,
  });
};

export const useUnreadCount = (channelId: string) => {
  return useQuery({
    queryKey: ["unread-count", channelId],
    queryFn: () => getUnreadCount(channelId),
    enabled: !!channelId,
  });
};

export const useSearchChannels = (workspaceId: string, search: string) => {
  return useQuery({
    queryKey: ["search-channels", workspaceId, search],
    queryFn: () => searchChannels(workspaceId, search),
    enabled: !!workspaceId && !!search.trim(),
  });
};

export const useJoinChannel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (channelId: string) => joinChannel(channelId),

    onSuccess: (_, channelId) => {
      queryClient.invalidateQueries({
        queryKey: ["channels", channelId],
      });
    },
  });
};
