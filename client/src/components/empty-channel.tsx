import { SproutIcon } from "lucide-react";

type EmptyChannelProps = {
  channelName: string;
};

export function EmptyChannel({ channelName }: EmptyChannelProps) {
  return (
    <div className="flex h-full min-h-0 items-center justify-center px-5 py-10">
      <div className="flex w-full max-w-130 flex-col items-center gap-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-primary bg-primary/10">
          <SproutIcon className="size-6 text-primary" />
        </div>

        <div className="flex w-full flex-col items-center gap-3">
          <h2 className="font-heading text-2xl tracking-tight text-foreground sm:text-[28px]">
            The birth of <span className="lowercase font-semibold">#{channelName}</span>
          </h2>

          <p className="max-w-130 text-sm leading-6 text-muted-foreground">
            This is the quiet beginning of a new workspace channel. Use this space to align
            timelines, share creative visual drafts, and coordinate release events.
          </p>
        </div>
      </div>
    </div>
  );
}
