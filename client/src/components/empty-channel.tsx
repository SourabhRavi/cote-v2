import { MessageCircle, Sparkles } from "lucide-react";

type EmptyChannelProps = { channelName: string };

export function EmptyChannel({ channelName }: EmptyChannelProps) {
  return (
    <div className="flex min-h-[360px] h-full items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-lg flex-col items-center gap-5 text-center">
        <div className="relative flex size-[76px] items-center justify-center rounded-[24px] border border-primary/15 bg-primary/[0.07] text-primary shadow-[0_12px_30px_rgba(98,103,181,0.09)]">
          <MessageCircle className="size-8" strokeWidth={1.7} />
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-background bg-primary text-white">
            <Sparkles className="size-3" />
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          A fresh start
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">
            The first word in <span className="text-primary">#{channelName}</span>
          </h2>
          <p className="max-w-md text-[13px] leading-7 text-muted-foreground">
            Every great conversation starts somewhere. Share an update, ask a question, or bring
            your team into an idea.
          </p>
        </div>
      </div>
    </div>
  );
}