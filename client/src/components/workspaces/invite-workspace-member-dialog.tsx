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
import { toast } from "@/components/ui/toast.tsx";
import axios from "axios";

type InviteWorkspaceMemberDialogProps = {
  workspaceId: string;
};

export function InviteWorkspaceMemberDialog({ workspaceId }: InviteWorkspaceMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const { mutate: createInvitation, isPending, reset } = useCreateWorkspaceInvitation();

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
          toast.add({
            type: "success",
            description: "Member invited.",
          });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.add({
              type: "error",
              description: error.response?.data?.message ?? "Failed to sendsss invitation.",
            });

            return;
          }

          toast.add({
            type: "error",
            description: "Failed to send invitatiossn.",
          });
        },
      },
    );
  };

  return (
    <SidebarMenu className="px-2 pt-2">
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

            <div className="flex flex-col gap-y-1">
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
              />
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
