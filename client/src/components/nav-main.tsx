import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { HashIcon } from "lucide-react";

type Channel = {
  id: string;
  name: string;
};

export function NavMain({
  items,
  isLoading,
  isError,
}: {
  items: Channel[];
  isLoading?: boolean;
  isError?: boolean;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>

      <SidebarMenu>
        {isLoading ? (
          [0, 1, 2].map((index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton disabled>
                <HashIcon className="size-4" />
                <Skeleton className="h-4 w-24" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        ) : isError ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-muted-foreground">Failed to load channels</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : items.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-muted-foreground">No channels</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          items.map((channel) => (
            <SidebarMenuItem key={channel.id}>
              <SidebarMenuButton tooltip={channel.name}>
                <HashIcon className="size-4" />
                <span>{channel.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
