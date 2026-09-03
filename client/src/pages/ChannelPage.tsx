import { AtSign, Paperclip, SmilePlus, XCircle } from "lucide-react";
import { useParams } from "react-router-dom";

import { SidebarTrigger } from "@/components/ui/sidebar";

const ChannelPage = () => {
  const { channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  return (
    <div className="flex h-full min-h-0 flex-col bg-background text-foreground">
      {/* Channel header */}
      <header className="flex min-h-19.75 shrink-0 items-center justify-between border-b px-4 py-4 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="md:hidden" />

          <div className="min-w-0">
            <h1 className="truncate font-heading text-lg font-semibold text-foreground">
              # {channelId}
            </h1>

            <p className="truncate text-xs text-muted-foreground">
              Architectural decisions and spatial product system drafts.
            </p>
          </div>
        </div>

        {/* later */}
        {/* <div className="flex shrink-0 items-center gap-3 text-muted-foreground">
          <button
            type="button"
            className="rounded-md p-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Search className="size-4.5" />
          </button>

          <button
            type="button"
            className="rounded-md p-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <XCircle className="size-4.5" />
          </button>

          <button
            type="button"
            className="rounded-md p-1.5 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <MoreHorizontal className="size-4.5" />
          </button>
        </div> */}
      </header>

      {/* Messages */}
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-5">
        <div className="mx-auto flex w-full flex-col gap-3">
          <article className="flex w-full gap-3 py-2">
            <div className="size-9 shrink-0 rounded-full border bg-muted" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Elena Vance</span>

                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    LEAD DESIGNER
                  </span>
                </div>

                <time className="shrink-0 text-xs text-muted-foreground">10:24 AM</time>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-foreground">
                I've been experimenting with our spatial layouts. Here is the draft for the new Cote
                navigation system. It focuses heavily on reducing structural noise so that
                conversation content stands out immediately.
              </p>

              <div className="mt-2 flex gap-1.5">
                <button className="rounded-md border border-primary bg-primary/10 px-2 py-1 text-xs text-primary">
                  ✨ 5
                </button>

                <button className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                  🌱 3
                </button>
              </div>
            </div>
          </article>

          <article className="flex w-full gap-3 py-2">
            <div className="size-9 shrink-0 rounded-full border bg-muted" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Marcus Brody</span>

                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    FRONTEND ARCHITECT
                  </span>
                </div>

                <time className="shrink-0 text-xs text-muted-foreground">10:26 AM</time>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-foreground">
                Looks incredibly clean. Love how the channels feel more like reading chapters in a
                well-typeset book rather than an overwhelming terminal command line.
                <span className="text-xs text-muted-foreground"> (edited)</span>
              </p>

              <div className="mt-2 flex">
                <button className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
                  👍 4
                </button>
              </div>
            </div>
          </article>

          <article className="flex w-full gap-3 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <XCircle className="size-4 text-muted-foreground" />
            </div>

            <p className="pt-1 text-sm text-muted-foreground">
              This message was removed by the administrator.
            </p>
          </article>

          <article className="flex w-full gap-3 py-2">
            <div className="size-9 shrink-0 rounded-full border bg-muted" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">Sarah Jenkins</span>

                  <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    PRODUCT MANAGER
                  </span>
                </div>

                <time className="shrink-0 text-xs text-muted-foreground">10:30 AM</time>
              </div>

              <p className="mt-1.5 text-sm leading-6 text-foreground">
                Let’s push this live into the internal alpha today. The developers are eager to see
                if this reduces screen fatigue during long remote syncs.
              </p>

              <div className="mt-2 flex">
                <button className="rounded-md border border-primary bg-primary/10 px-2 py-1 text-xs text-primary">
                  🙌 6
                </button>
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Composer */}
      <div className="shrink-0 border-t p-4 md:p-5">
        <div className="mx-auto w-full rounded-xl border bg-background p-3">
          <textarea
            rows={2}
            placeholder={`Type message in #${channelId}...`}
            className="
              min-h-10
              w-full
              resize-none
              bg-transparent
              text-sm
              leading-6
              text-foreground
              outline-none
              placeholder:text-muted-foreground
            "
          />

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <button
                type="button"
                className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Paperclip className="size-4.5" />
              </button>

              <button
                type="button"
                className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <SmilePlus className="size-4.5" />
              </button>

              <button
                type="button"
                className="rounded-md p-1 transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <AtSign className="size-4.5" />
              </button>
            </div>

            <button
              type="button"
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelPage;
