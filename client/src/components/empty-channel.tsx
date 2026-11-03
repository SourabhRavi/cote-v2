import { MessageCircle, Sparkles } from "lucide-react";

type EmptyChannelProps = { channelName: string };

export function EmptyChannel({ channelName }: EmptyChannelProps) {
  return (
    <div className="flex h-full min-h-[320px] items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-lg flex-col items-center gap-5 text-center">
        <div className="cote-welcome-symbol mb-0">
          <MessageCircle className="size-7" strokeWidth={1.7} />
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          A fresh start
        </div>
        <div className="flex w-full flex-col items-center gap-2">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-[30px]">
            The first word in <span className="text-primary">#{channelName}</span>
          </h2>
          <p className="max-w-md text-[13px] leading-7 text-muted-foreground">
            Every great conversation starts somewhere. Share an update, ask a question, or bring the team into an idea.
          </p>
        </div>
      </div>
    </div>
  );
}