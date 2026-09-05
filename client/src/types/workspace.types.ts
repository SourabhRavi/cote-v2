export type Workspace = {
  id: string;
  name: string;
};

export type WorkspaceInvitation = {
  id: string;
  workspaceId: string;
  userEmail: string;
  status: "invited" | "accepted" | "declined";
  createdAt: string;
  updatedAt: string;
  workspace: {
    id: string;
    name: string;
  };
};
