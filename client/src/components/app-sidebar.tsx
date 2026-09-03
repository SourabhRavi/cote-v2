"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEndIcon } from "lucide-react";

const data = {
  user: {
    name: "Sourabh",
    email: "sourabh@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Cote",
      logo: <GalleryVerticalEndIcon />,
      plan: "Workspace",
    },
  ],
  navMain: [
    {
      name: "general",
      url: "#",
    },
    {
      name: "random",
      url: "#",
    },
    {
      name: "engineering",
      url: "#",
      unread: 3,
    },
  ],
  projects: [
    {
      name: "Browse channels",
      url: "#",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
