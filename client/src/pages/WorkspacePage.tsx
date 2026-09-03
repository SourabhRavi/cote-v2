import { useParams } from "react-router-dom";

import useWorkspaces from "@/hooks/use-workspaces.ts";
import type { Workspace } from "@/types/workspace.types.ts";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const { data: workspaces = [], isPending, isError } = useWorkspaces();

  const workspace = workspaces.find((workspace: Workspace) => workspace.id === workspaceId);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError || !workspace) {
    return <div>Workspace not found.</div>;
  }

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6">
      <div className="w-full max-w-lg space-y-3 text-center">
        <p className="text-xs font-medium text-muted-foreground"># {workspace.name}</p>

        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Welcome to your workspace
        </h1>

        <p className="text-sm text-muted-foreground">
          Select a channel from the sidebar to start a conversation.
        </p>
      </div>
    </main>
  );
};

export default WorkspacePage;
