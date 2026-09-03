"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useWorkspaces from "@/hooks/use-workspaces.ts";

type Workspace = {
  id: string;
  name: string;
};

const WorkspaceSelectionPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data: workspaces = [], isPending, isError } = useWorkspaces();

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

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6">
      <div className="w-full max-w-4xl">
        {/* Header stays fixed */}
        <div className="mx-auto h-29 max-w-md text-center">
          <p className="text-xs font-medium text-muted-foreground">Welcome to Cote</p>

          <h1 className="mt-2 font-heading text-2xl font-semibold tracking-tight">
            Choose a workspace
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">Select a workspace to continue.</p>
        </div>

        {/* Search stays fixed */}
        <div className="mx-auto h-10 max-w-md">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search workspaces..."
              className="h-10 pl-9 text-xs"
            />
          </div>
        </div>

        {/* Workspace area has stable height */}
        <div className="mx-auto  w-full max-w-md mt-5 h-90 overflow-y-auto pr-1 scroll-fade scrollbar-none">
          {isPending ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="flex h-14 items-center justify-between rounded-md border px-4"
                >
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex h-full items-start justify-center pt-4">
              <p className="text-xs text-muted-foreground">Failed to load workspaces.</p>
            </div>
          ) : filteredWorkspaces.length === 0 ? (
            <div className="flex h-full items-start justify-center pt-4">
              <p className="text-xs text-muted-foreground">
                {search ? "No workspaces found." : "No workspaces available."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredWorkspaces.map((workspace: Workspace) => (
                <Button
                  key={workspace.id}
                  variant="outline"
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                  className="
                    h-14
                    w-full
                    justify-between
                    px-4
                    text-xs
                    font-normal
                  "
                >
                  <span className="truncate">{workspace.name}</span>

                  <span className="ml-3 shrink-0 text-xs text-muted-foreground">Workspace</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default WorkspaceSelectionPage;
