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
import { ChevronsUpDownIcon, PlusIcon } from "lucide-react";

type Workspace = {
  id: string;
  name: string;
};

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

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <Skeleton className="size-8 rounded-md" />

            <div className="grid flex-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-28" />
            </div>

            <ChevronsUpDownIcon className="ml-auto size-4 opacity-50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (isError) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <span className="truncate text-sm text-muted-foreground">
              Failed to load workspaces
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeWorkspace) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <span className="truncate text-sm text-muted-foreground">No workspaces</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="aria-expanded:bg-sidebar-accent text-sidebar-foreground! relative left-px"
              />
            }
          >
            <div className="flex relative size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-accent font-semibold uppercase text-card-foreground ring-1 ring-primary/20">
              {activeWorkspace.name.charAt(0).toUpperCase()}
            </div>

            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium capitalize">{activeWorkspace.name}</span>
            </div>

            <ChevronsUpDownIcon className="ml-auto" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-popper-anchor-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>

              {workspaces.map((workspace) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => onWorkspaceChange(workspace.id)}
                  className="gap-2 p-2 capitalize"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm bg-sidebar-accent font-semibold uppercase text-card-foreground">
                    {workspace.name.charAt(0).toUpperCase()}
                  </div>

                  <span>{workspace.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <PlusIcon className="size-4" />
                </div>

                <span className="font-medium text-muted-foreground">Add workspace</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
