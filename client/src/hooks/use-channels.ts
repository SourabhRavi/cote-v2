import { getChannel, getChannels, getUnreadCount } from "@/services/channel.service.ts";
import { useQuery } from "@tanstack/react-query";

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
