"use client";

import { Hash } from "lucide-react";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import type { Channel } from "@/types/channel.types.ts";

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
    <SidebarGroup className="flex min-h-0 flex-1 flex-col px-0 py-0">
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-none group-data-[collapsible=icon]:hidden">
        <SidebarMenu className="gap-1">
          {isLoading ? (
            [1, 2, 3, 4].map((item) => (
              <SidebarMenuItem key={item}>
                <SidebarMenuButton size="default" disabled className="h-9 px-3">
                  <Skeleton className="h-3.5 w-24" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))
          ) : isError ? (
            <SidebarMenuItem>
              <span className="px-3 py-2 text-xs text-muted-foreground">Couldn’t load channels</span>
            </SidebarMenuItem>
          ) : items.length === 0 ? (
            <SidebarMenuItem>
              <span className="block px-3 py-2 text-xs leading-5 text-muted-foreground">
                No channels yet. Create one to get the conversation started.
              </span>
            </SidebarMenuItem>
          ) : (
            items.map((channel) => {
              const isActive = channel.id === activeChannelId;
              return (
                <SidebarMenuItem key={channel.id}>
                  <SidebarMenuButton
                    size="default"
                    isActive={isActive}
                    tooltip={channel.name}
                    onClick={() => onChannelChange(channel.id)}
                    className="h-9 gap-2.5 px-3 text-[13px] font-normal data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-active:font-semibold"
                  >
                    <Hash className="size-3.5 opacity-55" />
                    <span className="truncate lowercase">{channel.name}</span>
                    {isActive && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
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