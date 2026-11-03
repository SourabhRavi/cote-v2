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
      { workspaceId, userEmail: email },
      {
        onSuccess: () => {
          setUserEmail("");
          setOpen(false);
          toast.add({ type: "success", description: "Member invited." });
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.add({
              type: "error",
              description: error.response?.data?.message ?? "Failed to send invitation.",
            });
            return;
          }
          toast.add({ type: "error", description: "Failed to send invitation." });
        },
      },
    );
  };

  return (
    <SidebarMenu className="px-1 pt-1">
      <SidebarMenuItem>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger render={<SidebarMenuButton tooltip="Invite member" />}>
            <UserPlus className="size-4" />
            <span>Invite member</span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite a teammate</DialogTitle>
              <DialogDescription>
                Send an invitation to someone who should have access to this workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-3 flex flex-col gap-2">
              <label htmlFor="workspace-member-email" className="text-xs font-semibold text-foreground">
                Email address
              </label>
              <Input
                id="workspace-member-email"
                type="email"
                placeholder="name@company.com"
                value={userEmail}
                onChange={(event) => setUserEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  handleInvite();
                }}
                disabled={isPending}
                autoFocus
                className="h-11"
              />
            </div>
            <DialogFooter className="mt-2">
              <Button
                type="button"
                className="h-10 rounded-xl px-4"
                onClick={handleInvite}
                disabled={!userEmail.trim() || isPending}
              >
                {isPending && <Loader2 className="size-4 animate-spin" />}
                {isPending ? "Sending invitation…" : "Send invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}