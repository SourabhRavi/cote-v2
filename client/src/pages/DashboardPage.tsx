import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardPage = () => {
  return (
    <SidebarInset>
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />

        <div className="flex flex-col">
          <h1 className="font-heading text-sm font-semibold"># general</h1>
          <p className="text-xs text-muted-foreground">General discussion</p>
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          No messages yet
        </div>

        <div className="border-t p-4">
          <div className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
            Message #general
          </div>
        </div>
      </main>
    </SidebarInset>
  );
};

export default DashboardPage;
