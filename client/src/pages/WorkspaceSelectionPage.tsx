"use client";

import { ArrowUpRight, Building2, Check, ChevronRight, Plus, SearchIcon, Users2 } from "lucide-react";
import { useMemo, useState } from "react";
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
import { CreateWorkspaceDialog } from "@/components/workspaces/create-workspace-dialog.tsx";

type Workspace = { id: string; name: string };
type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  userEmail: string;
  status: "invited" | "accepted" | "declined";
  workspace: { id: string; name: string };
};

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false);

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
    if (!query) return workspaces;
    return workspaces.filter((workspace: Workspace) => workspace.name.toLowerCase().includes(query));
  }, [workspaces, search]);

  const handleWorkspaceSelect = (workspaceId: string) => navigate(`/${workspaceId}`);

  const handleAcceptInvitation = (invitationId: string) => {
    if (isAccepting || isDeclining) return;
    acceptInvitation(invitationId, {
      onSuccess: (result) => navigate(`/${result.workspaceId}`),
    });
  };

  const handleDeclineInvitation = (invitationId: string) => {
    if (isAccepting || isDeclining) return;
    declineInvitation(invitationId);
  };

  return (
    <main className="cote-selection-page">
      <div className="cote-selection-shell">
        <header className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="cote-brand-mark flex size-10 items-center justify-center rounded-xl">
              <span className="font-heading text-lg font-bold">c.</span>
            </div>
            <div>
              <p className="font-heading text-[18px] font-semibold tracking-tight text-foreground">cote<span className="text-primary">.</span></p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.17em] text-muted-foreground">The team space</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Your workspaces
          </div>
        </header>

        <section className="mb-9 max-w-2xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-primary">A place to do your best work</p>
          <h1 className="font-heading text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[54px]">
            Good work is <span className="text-primary">better together.</span>
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-7 text-muted-foreground">
            Choose where you’re working today. Your channels, people, and conversations are right where you left them.
          </p>
        </section>

        <CreateWorkspaceDialog open={createWorkspaceOpen} onOpenChange={setCreateWorkspaceOpen} />

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
          <section className="cote-panel">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <h2 className="text-[15px] font-semibold text-foreground">Your workspaces</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Pick up where your team left off.</p>
              </div>
              <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold tabular-nums text-muted-foreground">
                {workspacesPending ? "…" : workspaces.length} total
              </span>
            </div>

            <div className="relative mb-4">
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a workspace…"
                className="h-11 rounded-xl pl-10 text-[13px]"
              />
            </div>

            {workspacesPending ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="rounded-2xl border border-border p-4">
                    <Skeleton className="mb-4 size-10 rounded-xl" />
                    <Skeleton className="mb-2 h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
              </div>
            ) : workspacesError ? (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-8 text-center text-sm text-destructive">
                We couldn’t load your workspaces. Please try again.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredWorkspaces.map((workspace: Workspace) => (
                  <button
                    key={workspace.id}
                    type="button"
                    onClick={() => handleWorkspaceSelect(workspace.id)}
                    className="cote-workspace-card group"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-[13px] font-bold uppercase text-primary">
                        {workspace.name.charAt(0)}
                      </span>
                      <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                    <p className="truncate text-[14px] font-semibold capitalize text-foreground">{workspace.name}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">Open workspace <ChevronRight className="ml-1 inline size-3" /></p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCreateWorkspaceOpen(true)}
                  className="flex min-h-28 flex-col items-start justify-between rounded-[15px] border border-dashed border-primary/30 bg-primary/[0.035] p-4 text-left transition-colors hover:border-primary/55 hover:bg-primary/[0.06]"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl border border-primary/15 bg-background text-primary">
                    <Plus className="size-4" />
                  </span>
                  <span>
                    <span className="block text-[13px] font-semibold text-foreground">Create a workspace</span>
                    <span className="mt-1 block text-[11px] text-muted-foreground">Start something new</span>
                  </span>
                </button>
              </div>
            )}

            {!workspacesPending && !workspacesError && filteredWorkspaces.length === 0 && (
              <div className="rounded-xl border border-dashed border-border py-8 text-center">
                <p className="text-sm font-medium text-foreground">{search ? "No matching workspaces" : "No workspaces yet"}</p>
                <p className="mt-1 text-xs text-muted-foreground">Create one to bring your team together.</p>
              </div>
            )}
          </section>

          <aside className="cote-panel">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Users2 className="size-4 text-primary" />
                  <h2 className="text-[15px] font-semibold text-foreground">Invitations</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Teams that have invited you.</p>
              </div>
              {!invitationsPending && invitations.length > 0 && (
                <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">{invitations.length}</span>
              )}
            </div>

            <div className="space-y-3">
              {invitationsPending ? (
                [1, 2].map((item) => (
                  <div key={item} className="rounded-xl border border-border p-4">
                    <Skeleton className="mb-2 h-4 w-32" />
                    <Skeleton className="mb-4 h-3 w-40" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))
              ) : invitationsError ? (
                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
                  Invitations couldn’t be loaded.
                </div>
              ) : invitations.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-4 py-9 text-center">
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Users2 className="size-4" />
                  </div>
                  <p className="text-[13px] font-medium text-foreground">All caught up</p>
                  <p className="mt-1 text-[11px] leading-5 text-muted-foreground">New workspace invitations will appear here.</p>
                </div>
              ) : (
                invitations.map((invitation: WorkspaceInvitation) => (
                  <div key={invitation.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold capitalize text-foreground">{invitation.workspace.name}</p>
                        <p className="mt-1 break-all text-[10px] text-muted-foreground">{invitation.userEmail}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 flex-1 rounded-lg text-xs"
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        disabled={isAccepting || isDeclining}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="h-9 flex-1 gap-1.5 rounded-lg text-xs"
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        disabled={isAccepting || isDeclining}
                      >
                        <Check className="size-3.5" /> Join
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex items-center justify-between gap-4 text-[10px] text-muted-foreground/65">
          <span>cote. · Thoughtful collaboration</span>
          <span className="hidden sm:inline">A quieter way to work together</span>
        </footer>
      </div>
    </main>
  );
};

export default WorkspaceSelectionPage;