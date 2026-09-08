import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { MessageList } from "@/components/messages/message-list.tsx";
import MessageComposer from "@/components/messages/message-composer.tsx";
import { ChannelSearch } from "@/components/channels/channel-search.tsx";

import { useChannel, useJoinChannel } from "@/hooks/use-channels.ts";
import { Separator } from "@base-ui/react";
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
      <div className="flex h-full min-h-0 flex-col text-foreground">
        <header className="flex min-h-10 shrink-0 items-center px-4 py-4 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="md:hidden" />

            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-32" />
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1">
          <div className="w-full px-4">
            <Separator className="inset-0 h-px w-full bg-sidebar-border" />
          </div>

          <div className="flex flex-col gap-6 py-4 md:py-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex gap-3">
                <Skeleton className="size-9 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-14" />
                  </div>

                  <Skeleton className="h-4 w-full max-w-2xl" />
                  <Skeleton className="h-4 w-3/4 max-w-xl" />
                </div>
              </div>
            ))}
          </div>
        </main>

        <div className="shrink-0">
          <div className="mx-auto h-full w-full rounded-xl bg-background p-3 shadow-lg shadow-primary/15">
            <Skeleton className="h-12 w-full" />

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="size-6 rounded-md" />
                <Skeleton className="size-6 rounded-md" />
              </div>

              <Skeleton className="h-7 w-12 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !channel) {
    return (
      <div className="flex h-full min-h-0 flex-col text-foreground">
        <header className="flex min-h-10 shrink-0 items-center px-4 py-4 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="md:hidden" />

            <div>
              <h1 className="font-heading text-lg font-semibold text-foreground">
                Channel unavailable
              </h1>

              <p className="text-xs text-muted-foreground">We couldn't load this channel.</p>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 items-center justify-center p-4">
          <div className="text-center">
            <h2 className="font-heading text-base font-semibold text-foreground">
              Unable to load channel
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The channel may have been deleted or you may not have access to it.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-foreground">
      {/* Channel header */}
      <header className="flex min-h-10 shrink-0 items-center justify-between px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold text-foreground lowercase">
              # {channel.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ChannelSearch workspaceId={channel.workspaceId} />
          <ThemeToggle />
        </div>
      </header>

      <div className="w-full px-4">
        <Separator className="inset-0 h-px w-full bg-sidebar-border" />
      </div>

      {/* Message list */}
      <MessageList channel={channel} onlineUsers={onlineUsers} />

      {/* Channel content */}
      {channel.isMember ? (
        <>
          <MessageComposer channel={channel} />
        </>
      ) : (
        <main className="flex min-h-0 flex-1 items-center justify-center p-4">
          <div className="w-full max-w-sm text-center">
            <h2 className="font-heading text-lg font-semibold text-foreground">
              Join #{channel.name}
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Join this channel to view messages and participate in the conversation.
            </p>

            <Button className="mt-4" onClick={handleJoinChannel} disabled={joinChannelIsPending}>
              {joinChannelIsPending ? "Joining..." : "Join Channel"}
            </Button>
          </div>
        </main>
      )}
    </div>
  );
};
