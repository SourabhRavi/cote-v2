"use client";

import { Hash, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useChannels, useCreateChannel } from "@/hooks/use-channels.ts";
import { useUser } from "@/hooks/use-user.ts";
import { InviteWorkspaceMemberDialog } from "@/components/workspaces/invite-workspace-member-dialog.tsx";
import { useWorkspaces } from "@/hooks/use-workspaces.ts";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();

  const { workspaceId, channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [channelName, setChannelName] = useState("");

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
  } = useChannels(currentWorkspaceId ?? "");

  const { mutate: createChannelMutation, isPending: createChannelIsPending } = useCreateChannel();

  const handleWorkspaceChange = (workspaceId: string) => {
    navigate(`/${workspaceId}`);
  };

  const handleChannelChange = (channelId: string) => {
    if (!currentWorkspaceId) return;

    navigate(`/${currentWorkspaceId}/${channelId}`);
  };

  const handleCreateChannel = () => {
    const name = channelName.trim();

    if (!currentWorkspaceId || !name || createChannelIsPending) {
      return;
    }

    createChannelMutation(
      {
        workspaceId: currentWorkspaceId,
        channelName: name,
      },
      {
        onSuccess: (channel) => {
          setChannelName("");
          setCreateChannelOpen(false);

          navigate(`/${currentWorkspaceId}/${channel.id}`);
        },
      },
    );
  };

  const { data: user, isPending: userIsPending, isError: userIsError } = useUser();

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader className="p-2">
        <TeamSwitcher
          workspaces={workspaces}
          activeWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={handleWorkspaceChange}
          isLoading={workspaceIsPending}
          isError={workspaceIsError}
        />
      </SidebarHeader>

      <SidebarContent className="px-2 mt-5">
        <div className="flex items-center justify-between">
          <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Channels
          </SidebarGroupLabel>

          {currentWorkspaceId && (
            <Dialog open={createChannelOpen} onOpenChange={setCreateChannelOpen}>
              <DialogTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 text-muted-foreground hover:text-foreground"
                  />
                }
              >
                <Plus className="size-4" />
                <span className="sr-only">Create channel</span>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create channel</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <Input
                    autoFocus
                    placeholder="Channel name"
                    value={channelName}
                    onChange={(event) => setChannelName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleCreateChannel();
                      }
                    }}
                  />

                  <Button
                    className="w-full"
                    onClick={handleCreateChannel}
                    disabled={!channelName.trim() || createChannelIsPending}
                  >
                    {createChannelIsPending ? "Creating..." : "Create channel"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Collapsed: show only the section icon */}
        <div className="hidden group-data-[state=collapsed]:block">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="sm" tooltip="Channels" className="justify-center">
                <Hash className="size-4" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

        <NavMain
          items={channels}
          activeChannelId={channelId}
          onChannelChange={handleChannelChange}
          isLoading={channelsIsPending}
          isError={channelsIsError}
        />
      </SidebarContent>

      {currentWorkspaceId && <InviteWorkspaceMemberDialog workspaceId={currentWorkspaceId} />}

      <SidebarFooter className="border-t px-2 py-2">
        <NavUser user={user} isLoading={userIsPending} isError={userIsError} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
