import { useParams } from "react-router-dom";

const WorkspacePage = () => {
  const { workspaceId } = useParams<{
    workspaceId: string;
  }>();

  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-background px-6">
      <div className="w-full max-w-lg space-y-3 text-center">
        <p className="text-xs font-medium text-muted-foreground italic">
          # Add Workspace name here
        </p>

        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          Welcome to your workspace
        </h1>

        <p className="text-sm text-muted-foreground">
          Select a channel from the sidebar to start a conversation.
        </p>

        <p className="pt-2 text-xs text-muted-foreground">{workspaceId}</p>
      </div>
    </main>
  );
};

export default WorkspacePage;
