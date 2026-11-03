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
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>
        </header>
        <main className="cote-message-scroll">
          <div className="cote-message-feed space-y-7">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="size-10 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-4 w-full max-w-2xl" />
                  <Skeleton className="h-4 w-3/4 max-w-xl" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <div className="cote-composer-wrap">
          <div className="cote-composer">
            <Skeleton className="h-14 w-full" />
            <div className="mt-3 flex justify-end">
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
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
              <p className="cote-topbar-eyebrow">Conversation</p>
              <h1 className="cote-topbar-title">Channel unavailable</h1>
            </div>
          </div>
          <ThemeToggle />
        </header>
        <main className="flex min-h-0 flex-1 items-center justify-center p-6">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl border border-border bg-muted text-muted-foreground">
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
          <div className="cote-icon-surface">
            <Hash className="size-[17px]" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="cote-topbar-eyebrow">Channel</p>
            <h1 className="cote-topbar-title truncate lowercase">{channel.name}</h1>
          </div>
          <span className="ml-2 hidden h-7 w-px bg-border sm:block" />
          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Users className="size-3.5" />
            </span>
            <span className="truncate text-[10px] text-muted-foreground">
              A shared space for the team
            </span>
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
        <div className="mx-auto mb-6 w-[min(100%-32px,620px)] rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="size-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Join #{channel.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Become a member to participate in this conversation.
                </p>
              </div>
            </div>
            <Button
              className="h-9 rounded-xl px-4"
              onClick={handleJoinChannel}
              disabled={joinChannelIsPending}
            >
              {joinChannelIsPending ? "Joining…" : "Join channel"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};