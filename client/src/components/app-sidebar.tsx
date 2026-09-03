"use client";

import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import useWorkspaces from "@/hooks/use-workspaces.ts";
import { useChannels } from "@/hooks/use-channels.ts";
import { useUser } from "@/hooks/use-user.ts";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  const {
    data: workspaces = [],
    isPending: workspaceIsPending,
    isError: workspaceIsError,
  } = useWorkspaces();

  const currentWorkspaceId = workspaceId ?? workspaces[0]?.id;

  const {
    data: channels = [],
    isPending: channelsIsPending,
    isError: channelsIsError,
  } = useChannels(currentWorkspaceId);

  const { data: user, isPending: userIsPending, isError: userIsError } = useUser();

  const handleWorkspaceChange = (workspaceId: string) => {
    navigate(`/${workspaceId}`);
  };

  const [activeChannelId, setActiveChannelId] = React.useState<string | undefined>(undefined);

  return (
    <Sidebar collapsible="icon" className="border-r" {...props}>
      <SidebarHeader className="px-3 py-3">
        <TeamSwitcher
          workspaces={workspaces}
          activeWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={handleWorkspaceChange}
          isLoading={workspaceIsPending}
          isError={workspaceIsError}
        />
      </SidebarHeader>

      <SidebarContent className="px-2">
        <NavMain
          items={channels}
          activeChannelId={activeChannelId}
          onChannelChange={setActiveChannelId}
          isLoading={channelsIsPending}
          isError={channelsIsError}
        />
      </SidebarContent>

      <SidebarFooter className="border-t px-2 py-2">
        <NavUser user={user} isLoading={userIsPending} isError={userIsError} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
