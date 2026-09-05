import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useCreateWorkspaceInvitation } from "@/hooks/use-workspaces.ts";

type InviteWorkspaceMemberDialogProps = {
  workspaceId: string;
};

export function InviteWorkspaceMemberDialog({ workspaceId }: InviteWorkspaceMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    mutate: createInvitation,
    isPending,
    isError,
    error,
    reset,
  } = useCreateWorkspaceInvitation();

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setUserEmail("");
      reset();
    }
  };

  const handleInvite = () => {
    const email = userEmail.trim().toLowerCase();

    if (!email || isPending) return;

    createInvitation(
      {
        workspaceId,
        userEmail: email,
      },
      {
        onSuccess: () => {
          setUserEmail("");
          setOpen(false);
        },
      },
    );
  };

  const errorMessage = error instanceof Error ? error.message : "Failed to send invitation.";

  return (
    <SidebarMenu className="px-2">
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<SidebarMenuButton tooltip="Invite member" />}>
            <UserPlus />
            <span>Invite member</span>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite workspace member</DialogTitle>

              <DialogDescription>
                Enter the email address of the person you want to invite to this workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <label htmlFor="workspace-member-email" className="text-sm font-medium">
                Email address
              </label>

              <Input
                id="workspace-member-email"
                type="email"
                placeholder="name@example.com"
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;

                  event.preventDefault();
                  handleInvite();
                }}
                disabled={isPending}
                autoFocus
                className="focus-visible:ring-0! focus-visible:ring-transparent! border-none"
              />

              {isError && <p className="text-sm text-destructive">{errorMessage}</p>}
            </div>

            <DialogFooter>
              <Button
                type="button"
                onClick={handleInvite}
                disabled={!userEmail.trim() || isPending}
              >
                {isPending && <Loader2 className="animate-spin" />}

                {isPending ? "Inviting..." : "Send invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
