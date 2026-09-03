import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CompassIcon, PlusIcon } from "lucide-react";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Discover</SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton>
                <a href={project.url} className="flex items-center gap-2">
                  <CompassIcon />
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton>
              <PlusIcon />
              <span>Create channel</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
