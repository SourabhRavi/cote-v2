import { useParams, useNavigate } from "react-router-dom";
import { ArrowUpRight, Hash, Sparkles } from "lucide-react";

import { ChannelSearch } from "@/components/channels/channel-search.tsx";
import { useChannels } from "@/hooks/use-channels.ts";
import { useWorkspaces } from "@/hooks/use-workspaces.ts";
import type { Workspace } from "@/types/workspace.types.ts";
import ThemeToggle from "@/components/common/theme-toggle.tsx";
import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { data: workspaces = [], isPending, isError } = useWorkspaces();
  const workspace = workspaces.find((item: Workspace) => item.id === workspaceId);
  const {
    data: channels = [],
    isPending: channelsPending,
    isError: channelsError,
  } = useChannels(workspaceId ?? "");

  if (isPending) return null;

  if (isError || !workspace) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Workspace not found.
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="cote-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="cote-icon-surface">
            <Hash className="size-[17px]" />
          </div>
          <div className="min-w-0">
            <p className="cote-topbar-eyebrow">Workspace</p>
            <h1 className="cote-topbar-title truncate capitalize">{workspace.name}</h1>
          </div>
        </div>
        <ThemeToggle />
      </header>

      <main className="cote-workspace-scroll">
        <div className="cote-workspace-content">
          <section className="cote-home-hero">
            <div className="relative z-10">
              <span className="cote-home-kicker">
                <Sparkles className="size-3.5" />
                Your team space
              </span>
              <h2 className="cote-home-heading">
                Good work happens <span className="text-primary">together.</span>
              </h2>
              <p className="cote-home-copy">
                A thoughtful place for the conversations, decisions, and ideas that move your team forward.
                Pick a channel and join the flow.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ChannelSearch workspaceId={workspace.id} />
                <span className="text-[10px] text-muted-foreground">
                  {channelsPending ? "Loading channels…" : channels.length + " channels in this workspace"}
                </span>
              </div>
            </div>
            <div className="cote-home-art" aria-hidden="true">
              <div className="cote-orbit" />
              <div className="cote-orbit-card">
                <svg className="cote-home-art-mark" viewBox="0 0 48 48" fill="none">
                  <path d="M9 12.5C9 10.57 10.57 9 12.5 9h23A3.5 3.5 0 0 1 39 12.5v16a3.5 3.5 0 0 1-3.5 3.5H24l-9 7v-7h-2.5A3.5 3.5 0 0 1 9 28.5v-16Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"/>
                  <path d="M16 18h16M16 24h11" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </section>

          <section>
            <div className="cote-section-heading">
              <div>
                <h2>Your channels</h2>
                <p>Jump back into a conversation or explore a new one.</p>
              </div>
              <span className="rounded-full border border-border bg-muted/70 px-3 py-1 text-[10px] font-semibold tabular-nums text-muted-foreground">
                {channelsPending ? "…" : channels.length + " total"}
              </span>
            </div>

            {channelsPending ? (
              <div className="cote-channel-grid">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-card p-4">
                    <Skeleton className="mb-4 size-9 rounded-xl" />
                    <Skeleton className="mb-2 h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : channelsError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-8 text-center">
                <p className="text-sm font-medium text-destructive">Channels couldn’t be loaded</p>
                <p className="mt-1 text-xs text-muted-foreground">Please refresh and try again.</p>
              </div>
            ) : channels.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/25 px-5 py-10 text-center">
                <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl border border-border bg-background text-primary">
                  <Hash className="size-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">No channels yet</p>
                <p className="mx-auto mt-1 max-w-sm text-xs leading-6 text-muted-foreground">
                  Create a channel from the sidebar or search for an existing channel to join.
                </p>
              </div>
            ) : (
              <div className="cote-channel-grid">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => navigate("/" + workspace.id + "/" + channel.id)}
                    className="cote-channel-card group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="cote-channel-card-icon">
                        <Hash className="size-4" />
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground/60 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="cote-channel-card-name">{channel.name}</p>
                        <p className="cote-channel-card-meta">
                          {channel.isMember ? "Your channel" : "Discover channel"}
                        </p>
                      </div>
                      {channel.isMember && (
                        <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default WorkspacePage;