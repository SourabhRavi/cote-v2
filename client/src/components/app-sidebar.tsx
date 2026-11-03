"use client";

import Logo from "@/assets/cote-logo.svg?react";
import { Hash, MailPlus, Plus } from "lucide-react";
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
  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>();
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
  const { data: user, isPending: userIsPending, isError: userIsError } = useUser();

  const handleWorkspaceChange = (nextWorkspaceId: string) => navigate("/" + nextWorkspaceId);

  const handleChannelChange = (nextChannelId: string) => {
    if (currentWorkspaceId) navigate("/" + currentWorkspaceId + "/" + nextChannelId);
  };

  const handleCreateChannel = () => {
    const name = channelName.trim();
    if (!currentWorkspaceId || !name || createChannelIsPending) return;

    createChannelMutation(
      { workspaceId: currentWorkspaceId, channelName: name },
      {
        onSuccess: (channel) => {
          setChannelName("");
          setCreateChannelOpen(false);
          navigate("/" + currentWorkspaceId + "/" + channel.id);
        },
      },
    );
  };

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader className="gap-4 px-3 pb-3 pt-4">
        <div className="cote-brand-lockup px-1 group-data-[collapsible=icon]:justify-center">
          <div className="cote-logo-tile">
            <Logo />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="cote-brand-name">cote<span className="text-primary">.</span></p>
            <p className="cote-brand-caption">A better space to work</p>
          </div>
        </div>

        <TeamSwitcher
          workspaces={workspaces}
          activeWorkspaceId={currentWorkspaceId}
          onWorkspaceChange={handleWorkspaceChange}
          isLoading={workspaceIsPending}
          isError={workspaceIsError}
        />
      </SidebarHeader>

      <SidebarContent className="mt-1 gap-4 px-2">
        <div>
          <div className="flex items-center justify-between px-2 pb-2">
            <SidebarGroupLabel className="h-auto p-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
              Channels
            </SidebarGroupLabel>

            {currentWorkspaceId && (
              <Dialog open={createChannelOpen} onOpenChange={setCreateChannelOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="size-7 rounded-lg text-muted-foreground hover:text-foreground"
                      aria-label="Create channel"
                    />
                  }
                >
                  <Plus className="size-4" />
                  <span className="sr-only">Create channel</span>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create a channel</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      autoFocus
                      placeholder="e.g. product-launch"
                      value={channelName}
                      onChange={(event) => setChannelName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleCreateChannel();
                      }}
                    />
                    <Button
                      className="h-10 w-full rounded-xl"
                      onClick={handleCreateChannel}
                      disabled={!channelName.trim() || createChannelIsPending}
                    >
                      {createChannelIsPending ? "Creating…" : "Create channel"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="hidden group-data-[state=collapsed]:block">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="sm" tooltip="Channels" className="justify-center">
                  <Hash />
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
        </div>

        {currentWorkspaceId && <InviteWorkspaceMemberDialog workspaceId={currentWorkspaceId} />}

        {currentWorkspaceId && (
          <SidebarMenu className="px-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => navigate("/")}
                size="default"
                className="h-9 text-[13px] font-medium text-muted-foreground hover:text-foreground"
              >
                <MailPlus className="size-4" />
                <span>Workspace invitations</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2 py-2">
        <NavUser user={user} isLoading={userIsPending} isError={userIsError} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}