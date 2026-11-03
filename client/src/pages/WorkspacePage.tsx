import { useParams } from "react-router-dom";
import { ArrowUpRight, MessageSquareText, Sparkles } from "lucide-react";

import { ChannelSearch } from "@/components/channels/channel-search.tsx";
import { useWorkspaces } from "@/hooks/use-workspaces.ts";
import type { Workspace } from "@/types/workspace.types.ts";
import ThemeToggle from "@/components/common/theme-toggle.tsx";
import { SidebarTrigger } from "@/components/ui/sidebar.tsx";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { data: workspaces = [], isPending, isError } = useWorkspaces();
  const workspace = workspaces.find((item: Workspace) => item.id === workspaceId);

  if (isPending) return null;
  if (isError || !workspace) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Workspace not found.</div>;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="cote-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <MessageSquareText className="size-[17px]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Workspace</p>
            <h1 className="truncate text-[14px] font-semibold capitalize text-foreground">{workspace.name}</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center px-5 py-12 md:px-10">
        <div className="cote-welcome">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Your team space
          </div>
          <div className="cote-welcome-symbol">
            <MessageSquareText className="size-7" strokeWidth={1.7} />
          </div>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-[42px] sm:leading-[1.12]">
            Good work happens <span className="text-primary">together.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-7 text-muted-foreground">
            Your workspace is ready. Find a channel, join the conversation, and bring the next idea to life.
          </p>
          <div className="mx-auto mt-8 flex w-full max-w-sm justify-center">
            <ChannelSearch workspaceId={workspace.id} />
          </div>
          <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground/75">
            <ArrowUpRight className="size-3" />
            Search channels to discover conversations
          </p>
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;