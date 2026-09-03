"use client";

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

  // get params from url
  const { workspaceId, channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  // get workspace data
  const {
    data: workspaces = [],
    isPending: workspaceIsPending,
    isError: workspaceIsError,
  } = useWorkspaces();

  const currentWorkspaceId = workspaceId ?? workspaces[0]?.id;

  // get channel data
  const {
    data: channels = [],
    isPending: channelsIsPending,
    isError: channelsIsError,
  } = useChannels(currentWorkspaceId);

  const handleWorkspaceChange = (workspaceId: string) => {
    navigate(`/${workspaceId}`);
  };

  const handleChannelChange = (channelId: string) => {
    if (!currentWorkspaceId) return;

    navigate(`/${currentWorkspaceId}/${channelId}`);
  };

  // get the user data
  const { data: user, isPending: userIsPending, isError: userIsError } = useUser();

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
          activeChannelId={channelId}
          onChannelChange={handleChannelChange}
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
