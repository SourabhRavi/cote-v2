import { getChannels } from "@/services/channel.service.ts";
import { useQuery } from "@tanstack/react-query";

export const useChannels = () => {
  return useQuery({
    queryKey: ["channels"],
    queryFn: getChannels,
  });
};
