import { getChannels } from "@/services/channel.service.ts";
import { useQuery } from "@tanstack/react-query";

export const useChannels = (workspaceId: string) => {
  return useQuery({
    queryKey: ["channels", workspaceId],
    queryFn: () => getChannels(workspaceId),
    enabled: !!workspaceId,
  });
};
