import { AtSign, Paperclip, SmilePlus } from "lucide-react";
import { useParams } from "react-router-dom";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useChannel } from "@/hooks/use-channels.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { MessageList } from "@/components/messages/message-list.tsx";

const ChannelPage = () => {
  const { channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  if (!channelId) {
    return null;
  }

  return <ChannelContent channelId={channelId} />;
};

const ChannelContent = ({ channelId }: { channelId: string }) => {
  const { data: channel, isPending, isError } = useChannel(channelId);

  if (isPending) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
        <header className="flex min-h-19.75 shrink-0 items-center border-b px-4 py-4 md:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger className="md:hidden" />

            <Skeleton className="h-5 w-32" />
          </div>
        </header>

        <main className="min-h-0 flex-1" />

        <div className="shrink-0 border-t p-4 md:p-5">
          <div className="mx-auto w-full rounded-xl border p-3">
            <Skeleton className="h-10 w-full" />

            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-2">
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
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
        <header className="flex min-h-19.75 shrink-0 items-center border-b px-4 py-4 md:px-5">
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

  // return <EmptyChannel channelName={channel.name} />;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background text-foreground">
      {/* Channel header */}
      <header className="flex min-h-19.75 shrink-0 items-center justify-between border-b px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div className="min-w-0">
            {isPending ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <h1 className="truncate font-heading text-lg font-semibold text-foreground lowercase">
                # {channel.name}
              </h1>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5 scrollbar-none">
        {/* messages */}
        <MessageList channel={channel} />
      </main>

      {/* Composer */}
      <div className="shrink-0 border-t p-4 md:p-5">
        <div className="mx-auto w-full rounded-xl border bg-background p-3">
          <textarea
            rows={2}
            placeholder={`Type message in #${channel.name}...`}
            className="
              min-h-10
              w-full
              resize-none
              bg-transparent
              text-sm
              leading-6
              text-foreground
              outline-none
              placeholder:text-muted-foreground
            "
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <button
                type="button"
                className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Paperclip className="size-4.5" />
              </button>

              <button
                type="button"
                className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <SmilePlus className="size-4.5" />
              </button>

              <button
                type="button"
                className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <AtSign className="size-4.5" />
              </button>
            </div>

            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
