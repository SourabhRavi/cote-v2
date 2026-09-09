import { EmptyChannel } from "@/components/empty-channel.tsx";
import { MessageItem } from "@/components/messages/message-item.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useGetMessages } from "@/hooks/use-messages.ts";
import { SOCKET_EVENTS } from "@/lib/socket-events.ts";
import { socket } from "@/lib/socket.ts";
import type { Channel } from "@/types/channel.types.ts";
import type { Message, MessageResponse } from "@/types/message.types.ts";
import { useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useEffect, useLayoutEffect, useRef } from "react";

export const MessageList = ({
  channel,
  onlineUsers = [],
}: {
  channel: Channel;
  onlineUsers: string[];
}) => {
  const messagesContainerRef = useRef<HTMLElement>(null);
  const shouldScrollToBottomRef = useRef(false);

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMessages(channel.id);

  const messages = data?.pages
    .slice()
    .flatMap((page) => page.messages)
    .reverse();

  // socket events
  const queryClient = useQueryClient();

  // scroll to bottom when channel is opened
  useLayoutEffect(() => {
    if (isPending) return;

    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [channel.id, isPending]);

  // update messages when new message arrives
  useEffect(() => {
    // join room:channelId
    socket.emit(SOCKET_EVENTS.CHANNEL_JOIN, channel.id);

    const handleNewMessage = (newMessage: Message) => {
      shouldScrollToBottomRef.current = true;

      queryClient.setQueryData<InfiniteData<MessageResponse, string>>(
        ["get-messages", channel.id],
        (oldMessagesData) => {
          if (!oldMessagesData) return undefined;

          return {
            ...oldMessagesData,
            pages: oldMessagesData.pages.map((page, index) => {
              if (index !== 0) return page;

              return {
                ...page,
                messages: [newMessage, ...page.messages],
              };
            }),
          };
        },
      );
    };

    const handleUpdateMessage = (updatedMessage: Message) => {
      queryClient.setQueryData<InfiniteData<MessageResponse, string>>(
        ["get-messages", channel.id],
        (oldMessagesData) => {
          if (!oldMessagesData) return undefined;

          return {
            ...oldMessagesData,
            pages: oldMessagesData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((message) =>
                message.id === updatedMessage.id ? updatedMessage : message,
              ),
            })),
          };
        },
      );
    };

    const handleDeleteMessage = (deletedMessage: Message) => {
      queryClient.setQueryData<InfiniteData<MessageResponse, string>>(
        ["get-messages", channel.id],
        (oldMessagesData) => {
          if (!oldMessagesData) return undefined;

          return {
            ...oldMessagesData,
            pages: oldMessagesData.pages.map((page) => ({
              ...page,
              messages: page.messages.map((message) =>
                message.id === deletedMessage.id ? { ...deletedMessage, content: null } : message,
              ),
            })),
          };
        },
      );
    };

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_UPDATE, handleUpdateMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_DELETE, handleDeleteMessage);

    return () => {
      socket.emit(SOCKET_EVENTS.CHANNEL_LEAVE, channel.id);

      socket.off(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_UPDATE, handleUpdateMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETE, handleDeleteMessage);
    };
  }, [channel.id, queryClient]);

  // load old message when user scrolls to top
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const handleFetchOldMessagesOnScroll = () => {
      if (container.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener("scroll", handleFetchOldMessagesOnScroll);

    return () => {
      container.removeEventListener("scroll", handleFetchOldMessagesOnScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // scroll when new message
  useEffect(() => {
    if (!shouldScrollToBottomRef.current) return;

    shouldScrollToBottomRef.current = false;

    const container = messagesContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container?.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages]);

  if (isPending) {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto py-2.5-4 md:py-5 px-0 scrollbar-none">
        <div className="flex flex-col gap-6">
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
    );
  }

  if (isError) {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto py-2.5-4 md:py-5 px-0 scrollbar-none">
        <p>Failed to load messages.</p>
      </main>
    );
  }

  if (!messages?.length) {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto py-2.5-4 md:py-5 px-0 scrollbar-none">
        <EmptyChannel channelName={channel.name} />
      </main>
    );
  }

  return (
    <>
      <main
        className="min-h-0 flex-1 overflow-y-auto py-2.5-4 md:py-5 px-0 scrollbar-none"
        ref={messagesContainerRef}
      >
        <div className="flex flex-col">
          {isFetchingNextPage && (
            <div className="flex items-center justify-center pb-3">
              <div className="flex items-center gap-2 opacity-50">
                <Spinner className="size-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Loading older messages</span>
              </div>
            </div>
          )}
          {messages.map((message: Message) => (
            <MessageItem key={message.id} message={message} onlineUsers={onlineUsers} />
          ))}
        </div>
      </main>
    </>
  );
};
