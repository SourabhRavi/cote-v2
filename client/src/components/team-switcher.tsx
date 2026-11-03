"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog.tsx";
import { ChevronsUpDownIcon, PlusIcon, Users2 } from "lucide-react";
import { useState } from "react";

type Workspace = { id: string; name: string };

type TeamSwitcherProps = {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceChange: (workspaceId: string) => void;
  isLoading?: boolean;
  isError?: boolean;
};

export function TeamSwitcher({
  workspaces,
  activeWorkspaceId,
  onWorkspaceChange,
  isLoading,
  isError,
}: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);

  if (isLoading || isError || !activeWorkspace) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            disabled
            className="h-[58px] rounded-xl border border-sidebar-border bg-background/75 px-3"
          >
            {isLoading ? (
              <Skeleton className="size-9 rounded-xl" />
            ) : (
              <Users2 className="size-4 text-muted-foreground" />
            )}
            <span className="truncate text-xs text-muted-foreground">
              {isLoading ? "Loading workspace…" : isError ? "Couldn’t load workspace" : "No workspace"}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="h-[58px] rounded-xl border border-sidebar-border bg-background/85 px-3 shadow-sm aria-expanded:bg-sidebar-accent"
                />
              }
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold uppercase text-primary">
                {activeWorkspace.name.charAt(0)}
              </div>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate text-[12px] font-semibold capitalize text-foreground">
                  {activeWorkspace.name}
                </span>
                <span className="mt-1 text-[10px] text-muted-foreground">
                  Current workspace
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-60 rounded-xl p-1.5 shadow-xl"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={8}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="px-2 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Switch workspace
                </DropdownMenuLabel>
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onClick={() => onWorkspaceChange(workspace.id)}
                    className="gap-2.5 rounded-lg p-2.5 capitalize"
                  >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {workspace.name.charAt(0)}
                    </div>
                    <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
                    {workspace.id === activeWorkspaceId && (
                      <span className="size-1.5 rounded-full bg-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1.5" />
              <DropdownMenuItem
                className="gap-2 rounded-lg p-2.5"
                onClick={() => setCreateWorkspaceOpen(true)}
              >
                <div className="flex size-8 items-center justify-center rounded-lg border border-border">
                  <PlusIcon className="size-4" />
                </div>
                <span className="font-medium">Create workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateWorkspaceDialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen} />
    </>
  );
}