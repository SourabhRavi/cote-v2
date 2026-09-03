import { getWorkspaces } from "@/services/workspace.service.ts";
import { useQuery } from "@tanstack/react-query";

export const useWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getWorkspaces,
  });
};

export default useWorkspaces;
