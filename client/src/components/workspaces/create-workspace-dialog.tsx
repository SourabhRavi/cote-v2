"use client";

import { useState } from "react";
import { useCreateWorkspace } from "@/hooks/use-workspaces.ts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type CreateWorkspaceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateWorkspaceDialog({ open, onOpenChange }: CreateWorkspaceDialogProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const { mutate: createWorkspace, isPending: isCreatingWorkspace } = useCreateWorkspace();

  const handleCreateWorkspace = () => {
    const name = workspaceName.trim();
    if (!name || isCreatingWorkspace) return;

    createWorkspace(
      { workspaceName: name },
      {
        onSuccess: () => {
          setWorkspaceName("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) setWorkspaceName("");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
          <DialogDescription>
            Give your team a shared place for channels, ideas, and everyday progress.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 space-y-4">
          <div className="space-y-2">
            <label htmlFor="new-workspace-name" className="text-xs font-semibold text-foreground">
              Workspace name
            </label>
            <Input
              id="new-workspace-name"
              autoFocus
              placeholder="e.g. Product team"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCreateWorkspace();
              }}
              disabled={isCreatingWorkspace}
              className="h-11"
            />
          </div>

          <Button
            className="h-10 w-full rounded-xl"
            onClick={handleCreateWorkspace}
            disabled={!workspaceName.trim() || isCreatingWorkspace}
          >
            {isCreatingWorkspace ? "Creating…" : "Create workspace"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}