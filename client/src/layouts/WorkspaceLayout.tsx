import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { ChannelSearch } from "@/components/channels/channel-search.tsx";
import { useChannel } from "@/hooks/use-channels.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Outlet, useParams } from "react-router-dom";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();
  const { data: channel, isPending, isError } = useChannel(channelId);

  if (isPending) {
    return (
      <header className="flex min-h-10 shrink-0 items-center justify-between px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div className="min-w-0">
            <Skeleton className="h-6 w-32" />
          </div>
        </div>

        <Skeleton className="h-8 w-32 rounded-md" />
      </header>
    );
  }

  if (isError || !channel) {
    return (
      <header className="flex min-h-10 shrink-0 items-center px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div className="min-w-0">
            <h1 className="font-heading text-lg font-semibold text-foreground">
              Channel unavailable
            </h1>

            <p className="text-xs text-muted-foreground">We couldn't load this channel.</p>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col text-foreground">
      <header className="flex min-h-10 shrink-0 items-center justify-between px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold text-foreground lowercase">
              # {channel.name}
            </h1>
          </div>
        </div>

        <ChannelSearch workspaceId={channel.workspaceId} />
      </header>
      <Outlet />
    </div>
  );
};

export default WorkspaceLayout;
