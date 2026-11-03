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

const getDayKey = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-CA");
};

const getDayLabel = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Earlier";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const difference = Math.round((today.getTime() - day.getTime()) / 86400000);

  if (difference === 0) return "Today";
  if (difference === 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export const MessageList = ({
  channel,
  onlineUsers = [],
}: {
  channel: Channel;
  onlineUsers: string[];
}) => {
  const messagesContainerRef = useRef<HTMLElement>(null);
  const shouldScrollToBottomRef = useRef(false);
  const previousScrollHeightRef = useRef(0);

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetMessages(channel.id);

  const messages = data?.pages.slice().flatMap((page) => page.messages).reverse();
  const queryClient = useQueryClient();

  useLayoutEffect(() => {
    if (isPending) return;
    const container = messagesContainerRef.current;
    if (!container) return;

    if (previousScrollHeightRef.current > 0) {
      const heightDifference = container.scrollHeight - previousScrollHeightRef.current;
      container.scrollTop = heightDifference;
      previousScrollHeightRef.current = 0;
      return;
    }

    container.scrollTop = container.scrollHeight;
  }, [channel.id, isPending, messages?.length]);

  useEffect(() => {
    socket.emit(SOCKET_EVENTS.CHANNEL_JOIN, channel.id);

    const handleNewMessage = (newMessage: Message) => {
      shouldScrollToBottomRef.current = true;
      queryClient.setQueryData<InfiniteData<MessageResponse, string>>(
        ["get-messages", channel.id],
        (oldMessagesData) => {
          if (!oldMessagesData) return undefined;
          return {
            ...oldMessagesData,
            pages: oldMessagesData.pages.map((page, index) =>
              index === 0 ? { ...page, messages: [newMessage, ...page.messages] } : page,
            ),
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
                message.id === deletedMessage.id
                  ? { ...deletedMessage, content: null }
                  : message,
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

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleFetchOldMessagesOnScroll = () => {
      if (container.scrollTop > 0 || !hasNextPage || isFetchingNextPage) return;
      previousScrollHeightRef.current = container.scrollHeight;
      fetchNextPage();
    };

    container.addEventListener("scroll", handleFetchOldMessagesOnScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleFetchOldMessagesOnScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!shouldScrollToBottomRef.current) return;
    shouldScrollToBottomRef.current = false;

    const container = messagesContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    });
  }, [messages]);

  if (isPending) {
    return (
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
    );
  }

  if (isError) {
    return (
      <main className="cote-message-scroll">
        <div className="mx-auto mt-12 max-w-sm rounded-2xl border border-border bg-card p-7 text-center shadow-sm">
          <p className="text-sm font-semibold text-foreground">Messages couldn’t be loaded</p>
          <p className="mt-1 text-xs leading-6 text-muted-foreground">
            Refresh the channel and try again.
          </p>
        </div>
      </main>
    );
  }

  if (!messages?.length) {
    return (
      <main className="cote-message-scroll">
        <EmptyChannel channelName={channel.name} />
      </main>
    );
  }

  return (
    <main className="cote-message-scroll" ref={messagesContainerRef} aria-label="Channel messages">
      <div className="cote-message-feed" role="log" aria-live="polite">
        {isFetchingNextPage && (
          <div className="flex items-center justify-center pb-4">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] text-muted-foreground shadow-sm">
              <Spinner className="size-3.5" />
              Loading earlier messages
            </div>
          </div>
        )}
        {messages.map((message: Message, index: number) => {
          const previousMessage = messages[index - 1];
          const showDayDivider =
            !previousMessage || getDayKey(previousMessage.createdAt) !== getDayKey(message.createdAt);

          return (
            <div key={message.id}>
              {showDayDivider && (
                <div className="cote-day-divider">
                  <span>{getDayLabel(message.createdAt)}</span>
                </div>
              )}
              <MessageItem message={message} onlineUsers={onlineUsers} />
            </div>
          );
        })}
      </div>
    </main>
  );
};