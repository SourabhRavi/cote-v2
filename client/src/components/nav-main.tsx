"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

type Channel = {
  id: string;
  name: string;
  unread?: number;
};

export function NavMain({
  items,
  activeChannelId,
  onChannelChange,
  isLoading,
  isError,
}: {
  items: Channel[];
  activeChannelId?: string;
  onChannelChange: (channelId: string) => void;
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <SidebarGroup className="flex min-h-0 flex-1 flex-col px-0">
      {/* Fixed heading */}
      <SidebarGroupLabel className="shrink-0 px-3 text-xs uppercase">Channels</SidebarGroupLabel>

      {/* Only channel list scrolls */}
      <div className="min-h-0 flex-1 overflow-y-auto scroll-fade scrollbar-none">
        <SidebarMenu className="gap-0.5">
          {isLoading ? (
            [1, 2, 3, 4].map((item) => (
              <SidebarMenuItem key={item}>
                <SidebarMenuButton size="sm" disabled className="h-8 px-3">
                  <Skeleton className="h-3.5 w-20" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : isError ? (
            <SidebarMenuItem>
              <span className="px-3 py-2 text-xs text-muted-foreground">
                Failed to load channels
              </span>
            </SidebarMenuItem>
          ) : items.length === 0 ? (
            <SidebarMenuItem>
              <span className="px-3 py-2 text-xs text-muted-foreground">No channels yet</span>
            </SidebarMenuItem>
          ) : (
            items.map((channel) => {
              const isActive = channel.id === activeChannelId;

              return (
                <SidebarMenuItem key={channel.id}>
                  <SidebarMenuButton
                    size="sm"
                    isActive={isActive}
                    tooltip={channel.name}
                    onClick={() => onChannelChange(channel.id)}
                    className="
                      h-8
                      px-3
                      text-xs
                      font-normal
                      data-active:font-semibold
                      data-active:text-primary
                      data-active:hover:text-primary
                      data-active:bg-primary/10
                      data-active:hover:bg-primary/10
                    "
                  >
                    <span className="truncate"># {channel.name}</span>

                    {channel.unread ? (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {channel.unread}
                      </span>
                    ) : null}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })
          )}
        </SidebarMenu>
      </div>
    </SidebarGroup>
  );
}
