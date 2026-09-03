import { getChannel, getChannels } from "@/services/channel.service.ts";
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
