"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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

export function TeamSwitcher({
  workspaces,
  activeWorkspaceId,
  onWorkspaceChange,
  isLoading,
  isError,
}: {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  onWorkspaceChange: (workspaceId: string) => void;
  isLoading?: boolean;
  isError?: boolean;
}) {
  const { isMobile } = useSidebar();

  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
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
                className="
                data-open:bg-sidebar-accent
                data-open:text-sidebar-accent-foreground
                group-data-[collapsible=icon]:size-8
                group-data-[collapsible=icon]:p-0
                group-data-[collapsible=icon]:justify-center
              "
              />
            }
          >
            {/* Workspace icon */}
            <div
              className="
              flex size-8 shrink-0 items-center justify-center rounded-md
              bg-sidebar-accent text-xs font-semibold
              group-data-[collapsible=icon]:size-7
            "
            >
              {activeWorkspace.name.charAt(0).toUpperCase()}
            </div>

            {/* Workspace name - expanded only */}
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium capitalize">{activeWorkspace.name}</span>
            </div>

            {/* Dropdown arrow - expanded only */}
            <ChevronsUpDownIcon className="ml-auto group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-fit"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Workspaces
              </DropdownMenuLabel>

              {workspaces.map((workspace, index) => (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => onWorkspaceChange(workspace.id)}
                  className="gap-2 p-2 capitalize"
                >
                  {workspace.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <PlusIcon className="size-4" />
                </div>

                <div className="font-medium text-muted-foreground">Add workspace</div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
