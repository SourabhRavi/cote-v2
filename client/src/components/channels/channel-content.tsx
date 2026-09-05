import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChannel } from "@/hooks/use-channels.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { MessageList } from "@/components/messages/message-list.tsx";
import { Separator } from "@base-ui/react";
import MessageComposer from "@/components/messages/message-composer.tsx";
// import { useEffect } from "react";
// import { socket } from "@/lib/socket.ts";
// import { SOCKET_EVENTS } from "@/lib/socket-events.ts";
// import type { Message } from "@/types/message.types.ts";
// import { useQueryClient } from "@tanstack/react-query";

export const ChannelContent = ({ channelId }: { channelId: string }) => {
  const { data: channel, isPending, isError } = useChannel(channelId);
  // const { data: messages = [] } = useGetMessages(channelId);

  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   socket.emit(SOCKET_EVENTS.CHANNEL_JOIN, channelId);

  //   const handleNewMessage = (message: Message) => {
  //     queryClient.setQueryData<Message[]>(["get-messages", channelId], (oldMessages) => {
  //       if (!oldMessages) return [message];

  //       return [...oldMessages, message];
  //     });
  //   };

  //   socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);

  //   return () => {
  //     socket.emit(SOCKET_EVENTS.CHANNEL_LEAVE, channelId);
  //     socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
  //   };
  // }, [channelId, queryClient]);

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
            <Separator className="w-full inset-0 bg-sidebar-border h-px" />
          </div>
          <div className="flex flex-col gap-6 p-4 md:p-5 ">
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
          <div className="mx-auto h-full w-full rounded-xl bg-background shadow-lg shadow-primary/15 p-3">
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
            {isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <>
                <h1 className="truncate font-heading text-lg font-semibold text-foreground lowercase">
                  # {channel.name}
                </h1>

                {!channel.description && (
                  <p className="truncate text-xs text-muted-foreground">{channel.description}</p>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <div className="w-full px-4">
        <Separator className="w-full inset-0 bg-sidebar-border h-px" />
      </div>

      {/* Messages */}
      <MessageList channel={channel} />

      {/* Composer */}
      <MessageComposer channel={channel} />
    </div>
  );
};
