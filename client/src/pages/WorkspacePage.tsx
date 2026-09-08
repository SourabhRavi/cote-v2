import { useParams } from "react-router-dom";

import { ChannelSearch } from "@/components/channels/channel-search.tsx";
import { useWorkspaces } from "@/hooks/use-workspaces.ts";
import type { Workspace } from "@/types/workspace.types.ts";
import ThemeToggle from "@/components/common/theme-toggle.tsx";
import { SidebarTrigger } from "@/components/ui/sidebar.tsx";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  const { data: workspaces = [], isPending, isError } = useWorkspaces();

  const workspace = workspaces.find((workspace: Workspace) => workspace.id === workspaceId);

  if (isPending) {
    return null;
  }

  if (isError || !workspace) {
    return <div>Workspace not found.</div>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex min-h-10 shrink-0 items-center justify-between px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <h1 className="truncate font-heading text-lg font-semibold text-foreground">
            # {workspace.name}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="w-full max-w-lg space-y-3 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight">
            Welcome to <br className="lg:hidden" />
            <span className="text-primary">#{workspace.name}</span>
          </h2>

          <p className="text-sm text-muted-foreground mb-8">
            Select a channel from the sidebar to start a conversation.
          </p>

          <ChannelSearch workspaceId={workspace.id} />
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;
