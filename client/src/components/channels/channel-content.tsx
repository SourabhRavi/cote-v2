import { Hash, MessageCircle, Users } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { MessageList } from "@/components/messages/message-list.tsx";
import MessageComposer from "@/components/messages/message-composer.tsx";
import { ChannelSearch } from "@/components/channels/channel-search.tsx";
import { useChannel, useJoinChannel } from "@/hooks/use-channels.ts";
import ThemeToggle from "@/components/common/theme-toggle.tsx";

export const ChannelContent = ({
  channelId,
  onlineUsers = [],
}: {
  channelId: string;
  onlineUsers: string[];
}) => {
  const { data: channel, isPending, isError } = useChannel(channelId);
  const { mutate: joinChannel, isPending: joinChannelIsPending } = useJoinChannel();

  const handleJoinChannel = () => {
    if (!channel || joinChannelIsPending) return;
    joinChannel(channelId);
  };

  if (isPending) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <header className="cote-topbar">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <Skeleton className="h-8 w-36 rounded-lg" />
          </div>
        </header>
        <main className="cote-message-scroll">
          <div className="cote-message-feed space-y-7">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-full max-w-2xl" />
                  <Skeleton className="h-4 w-3/4 max-w-xl" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className="cote-composer-wrap">
          <div className="cote-composer">
            <Skeleton className="h-12 w-full" />
            <div className="mt-3 flex justify-end"><Skeleton className="h-9 w-24 rounded-lg" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <header className="cote-topbar">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="md:hidden" />
            <div>
              <h1 className="text-sm font-semibold text-foreground">Channel unavailable</h1>
              <p className="mt-0.5 text-xs text-muted-foreground">We couldn’t load this conversation.</p>
            </div>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <MessageCircle className="size-5" />
            </div>
            <h2 className="font-heading text-xl font-semibold">This channel isn’t available</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              It may have been removed, or you may no longer have access to it.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-foreground">
      <header className="cote-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Hash className="size-[17px]" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">Channel</p>
            <h1 className="truncate text-[14px] font-semibold lowercase text-foreground">{channel.name}</h1>
          </div>
          <span className="ml-1 hidden h-5 w-px bg-border sm:block" />
          <div className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
            <Users className="size-3.5" />
            <span>Team conversation</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ChannelSearch workspaceId={channel.workspaceId} />
          <ThemeToggle />
        </div>
      </header>

      <MessageList channel={channel} onlineUsers={onlineUsers} />

      {channel.isMember ? (
        <MessageComposer channel={channel} />
      ) : (
        <main className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-7 text-center shadow-sm">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
            <h2 className="font-heading text-xl font-semibold">Join #{channel.name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Join this channel to see the conversation and share your thoughts with the team.
            </p>
            <Button className="mt-5 h-10 rounded-xl px-5" onClick={handleJoinChannel} disabled={joinChannelIsPending}>
              {joinChannelIsPending ? "Joining…" : "Join channel"}
            </Button>
          </div>
        </main>
      )}
    </div>
  );
};