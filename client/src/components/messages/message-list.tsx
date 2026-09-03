import { EmptyChannel } from "@/components/empty-channel.tsx";
import { MessageItem } from "@/components/messages/message-item.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useGetMessages } from "@/hooks/use-messages.ts";
import type { Channel } from "@/types/channel.types.ts";
import type { Message } from "@/types/message.types.ts";

export const MessageList = ({ channel }: { channel: Channel }) => {
  const { data: messages = [], isPending, isError } = useGetMessages(channel.id);

  if (isPending) {
    return (
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
    );
  }

  if (isError) {
    return <p>Failed to load messages.</p>;
  }

  if (!messages.length) {
    return <EmptyChannel channelName={channel.name} />;
  }

  return (
    <div className="flex flex-col">
      {messages.map((message: Message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  );
};
