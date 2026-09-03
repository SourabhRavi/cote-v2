import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HashIcon } from "lucide-react";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    url: string;
    unread?: number;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Channels</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton tooltip={item.name}>
              <a href={item.url} className="flex items-center gap-1">
                <HashIcon />
                <span>{item.name}</span>

                {item.unread ? <span className="ml-auto text-xs">{item.unread}</span> : null}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
