"use client";

import { useState } from "react";

import { useCreateWorkspace } from "@/hooks/use-workspaces.ts";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      { workspaceName },
      {
        onSuccess: () => {
          setWorkspaceName("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create workspace</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            autoFocus
            placeholder="Workspace name"
            value={workspaceName}
            onChange={(event) => setWorkspaceName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCreateWorkspace();
              }
            }}
          />

          <Button
            className="w-full"
            onClick={handleCreateWorkspace}
            disabled={!workspaceName.trim() || isCreatingWorkspace}
          >
            {isCreatingWorkspace ? "Creating..." : "Create workspace"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
