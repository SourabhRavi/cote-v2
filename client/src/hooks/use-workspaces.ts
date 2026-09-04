import { getWorkspaceUnreadCounts, getWorkspaces } from "@/services/workspace.service.ts";
import { useQuery } from "@tanstack/react-query";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
};

export const useWorkspacesUnreadCounts = (workspaceId: string) => {
  return useQuery({
    queryKey: ["unread-counts", workspaceId],
    queryFn: () => getWorkspaceUnreadCounts(workspaceId),
    enabled: !!workspaceId,
  });
};

export default useWorkspaces;
