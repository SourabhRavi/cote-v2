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
import { useEffect, useRef, useState } from "react";

export const MessageList = ({ channel }: { channel: Channel }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLElement>(null);

  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetMessages(channel.id);

  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const messages = data?.pages
    .slice()
    .flatMap((page) => page.messages)
    .reverse();

  // socket events
  const queryClient = useQueryClient();

  // update messages when new message arrives
  useEffect(() => {
    // join room:channelId
    socket.emit(SOCKET_EVENTS.CHANNEL_JOIN, channel.id);

    const handleNewMessage = (newMessage: Message) => {
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

  // set active users
  useEffect(() => {
    const handleUserOnline = ({ userId }: { userId: string }) => {
      console.log("ONLINE HAI MERE BHAI");

      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.add(userId);

        return next;
      });
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    };

    socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
    return () => {
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
    };
  }, []);

  if (isPending) {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5 scrollbar-none">
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
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5 scrollbar-none">
        <p>Failed to load messages.</p>
      </main>
    );
  }

  if (!messages) {
    return (
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5 scrollbar-none">
        <EmptyChannel channelName={channel.name} />
      </main>
    );
  }

  return (
    <>
      <main
        className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5 scrollbar-none"
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
        <div ref={messagesEndRef} />
      </main>
    </>
  );
};
