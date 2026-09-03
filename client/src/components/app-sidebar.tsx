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
import useWorkspaces from "@/hooks/use-workspaces.ts";
import { useChannels } from "@/hooks/use-channels.ts";

const data = {
  user: {
    name: "Sourabh",
    email: "sourabh@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Cote Design",
      logo: <GalleryVerticalEndIcon />,
      plan: "4 members online",
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
  const {
    data: workspaces = [],
    isPending: workspaceIsPending,
    isError: workspaceIsError,
  } = useWorkspaces();

  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState<string | undefined>(undefined);

  const currentWorkspaceId = activeWorkspaceId ?? workspaces[0]?.id;

  const {
    data: channels = [],
    isPending: channelsIsPending,
    isError: channelsError,
  } = useChannels(currentWorkspaceId);

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="px-3 py-3">
        <TeamSwitcher
          workspaces={workspaces}
          activeWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={setActiveWorkspaceId}
          isLoading={workspaceIsPending}
          isError={workspaceIsError}
        />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavMain items={channels} isLoading={channelsIsPending} isError={channelsError} />
        <NavProjects projects={data.projects} />
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-2">
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
