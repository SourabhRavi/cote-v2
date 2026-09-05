"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAcceptWorkspaceInvitation,
  useDeclineWorkspaceInvitation,
  useWorkspaceInvitations,
  useWorkspaces,
} from "@/hooks/use-workspaces.ts";

type Workspace = {
  id: string;
  name: string;
};

type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  userEmail: string;
  status: "invited" | "accepted" | "declined";
  workspace: {
    id: string;
    name: string;
  };
};

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const {
    data: workspaces = [],
    isPending: workspacesPending,
    isError: workspacesError,
  } = useWorkspaces();

  const {
    data: invitations = [],
    isPending: invitationsPending,
    isError: invitationsError,
  } = useWorkspaceInvitations();

  const { mutate: acceptInvitation, isPending: isAccepting } = useAcceptWorkspaceInvitation();

  const { mutate: declineInvitation, isPending: isDeclining } = useDeclineWorkspaceInvitation();

  const filteredWorkspaces = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return workspaces;
    }

    return workspaces.filter((workspace: Workspace) =>
      workspace.name.toLowerCase().includes(query),
    );
  }, [workspaces, search]);

  const handleWorkspaceSelect = (workspaceId: string) => {
    navigate(`/${workspaceId}`);
  };

  const handleAcceptInvitation = (invitationId: string) => {
    if (isAccepting || isDeclining) return;

    acceptInvitation(invitationId, {
      onSuccess: (result) => {
        navigate(`/${result.workspaceId}`);
      },
    });
  };

  const handleDeclineInvitation = (invitationId: string) => {
    if (isAccepting || isDeclining) return;

    declineInvitation(invitationId);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-page px-4 py-8 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mx-auto h-29 max-w-md text-center">
          <p className="text-xs font-medium text-muted-foreground">Welcome to Cote</p>

          <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
            Choose a workspace
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">Select a workspace to continue.</p>
        </div>

        {/* Search */}
        <div className="mx-auto h-10 max-w-md">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workspaces..."
              className="h-10 border-none bg-background! pl-9 text-xs shadow-md shadow-primary/15 focus-visible:ring-0! focus-visible:ring-transparent!"
            />
          </div>
        </div>

        {/* Your Workspaces */}
        <section className="mx-auto mt-5 w-full max-w-md">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-medium text-muted-foreground">Your Workspaces</h2>
          </div>

          {workspacesPending ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex h-14 items-center justify-between rounded-md border px-4"
                >
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          ) : workspacesError ? (
            <div className="flex h-14 items-center justify-center rounded-md border">
              <p className="text-xs text-muted-foreground">Failed to load workspaces.</p>
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="flex h-14 items-center justify-center rounded-md border">
              <p className="text-xs text-muted-foreground">
                {search ? "No workspaces found." : "No workspaces available."}
              </p>
            </div>
          ) : (
            <div className="flex max-h-48 flex-col gap-2 overflow-y-auto scrollbar-none">
              {filteredWorkspaces.map((workspace: Workspace) => (
                <Button
                  key={workspace.id}
                  variant="outline"
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                  className="h-14 w-full justify-between bg-transparent px-4 text-xs font-normal hover:bg-sidebar-accent"
                >
                  <span className="truncate font-medium">{workspace.name}</span>

                  <span className="ml-3 shrink-0 text-xs text-muted-foreground/50">Workspace</span>
                </Button>
              ))}
            </div>
          )}
        </section>

        {/* Invitations */}
        <section className="mx-auto mt-8 w-full max-w-md">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-medium text-muted-foreground">Invitations</h2>

            {!invitationsPending && invitations.length > 0 && (
              <span className="text-xs text-muted-foreground/50">{invitations.length}</span>
            )}
          </div>

          {invitationsPending ? (
            <div className="flex flex-col gap-2">
              {[1, 2].map((item) => (
                <div key={item} className="h-20 rounded-md border px-4 py-3">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="mt-2 h-3 w-24" />
                </div>
              ))}
            </div>
          ) : invitationsError ? (
            <div className="flex h-14 items-center justify-center rounded-md border">
              <p className="text-xs text-muted-foreground">Failed to load invitations.</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="flex h-14 items-center justify-center rounded-md border">
              <p className="text-xs text-muted-foreground">No pending invitations.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {invitations.map((invitation: WorkspaceInvitation) => (
                <div key={invitation.id} className="rounded-md border px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{invitation.workspace.name}</p>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        Workspace ID: {invitation.workspaceId}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={isAccepting || isDeclining}
                      className="text-xs"
                    >
                      Decline
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={isAccepting || isDeclining}
                      className="text-xs"
                    >
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default WorkspaceSelectionPage;
