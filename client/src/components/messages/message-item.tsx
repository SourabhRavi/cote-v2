import type { Message } from "@/types/message.types.ts";

type MessageItemProps = {
  message: Message;
};

export const MessageItem = ({ message }: MessageItemProps) => {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="size-9 shrink-0 overflow-hidden rounded-[18px]">
        {message.author.avatarUrl ? (
          <img
            src={message.author.avatarUrl}
            alt={message.author.name}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-[18px] bg-muted text-xs font-semibold text-muted-foreground">
            {message.author.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex w-full items-baseline justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold text-foreground">{message.author.name}</p>
          </div>

          <p className="shrink-0 text-[11px] text-muted-foreground/60 uppercase">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <p className="min-w-0 text-sm leading-normal text-foreground wrap-break-word">
          {message.content}
        </p>

        {/* Reactions will be added here later. */}
      </div>
    </div>
  );
};
