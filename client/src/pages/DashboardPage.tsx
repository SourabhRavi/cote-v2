import { AtSign, MoreHorizontal, Paperclip, Search, Smile, XCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

const DashboardPage = () => {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Chat header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div>
            <h1 className="font-heading text-lg font-semibold"># general</h1>
            <p className="text-xs text-muted-foreground">General discussion</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-muted-foreground">
          <Search className="size-5" />
          <XCircle className="size-5" />
          <MoreHorizontal className="size-5" />
        </div>
      </header>

      {/* Messages area */}
      <main className="flex min-h-0 flex-1" />

      {/* Composer */}
      <div className="shrink-0 border-t p-4 md:px-6">
        <div className="mx-auto max-w-4xl rounded-xl border bg-background">
          <textarea
            rows={2}
            placeholder="Message #general..."
            className="w-full resize-none bg-transparent px-4 pt-3 text-sm outline-none placeholder:text-muted-foreground"
          />

          <div className="flex items-center justify-between px-3 pb-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Paperclip className="size-4" />
              <Smile className="size-4" />
              <AtSign className="size-4" />
            </div>

            <button className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
