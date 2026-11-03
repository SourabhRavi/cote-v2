import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDeleteMessage, useUpdateMessage } from "@/hooks/use-messages.ts";
import type { Message } from "@/types/message.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { useUser } from "@/hooks/use-user.ts";

type MessageItemProps = { message: Message; onlineUsers: string[] };

export const MessageItem = ({ message, onlineUsers = [] }: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [content, setContent] = useState(message.content ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateMessage, isPending: isUpdatePending } = useUpdateMessage();
  const { mutate: deleteMessage, isPending: isDeletePending } = useDeleteMessage();
  const { data: user } = useUser();

  const isAuthorOnline = onlineUsers.includes(message.author.id);
  const isOwnMessage = Boolean(user?.id && message.author.id === user.id);

  const handleEdit = () => {
    setContent(message.content ?? "");
    setIsEditing(true);
    setIsMoreActionsOpen(false);
  };

  const handleDelete = () => {
    deleteMessage(
      { messageId: message.id },
      { onSuccess: () => setIsMoreActionsOpen(false) },
    );
  };

  const handleCancel = () => {
    setContent(message.content ?? "");
    setIsEditing(false);
  };

  const handleSave = () => {
    const trimmedContent = content.trim();
    if (!trimmedContent || trimmedContent === message.content) {
      handleCancel();
      return;
    }

    updateMessage(
      { messageId: message.id, content: trimmedContent },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (!isEditing || !textareaRef.current) return;

    textareaRef.current.focus();
    const cursorPosition = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
  }, [isEditing]);

  const timeLabel = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <article className="cote-message-row group">
      <div className="relative shrink-0">
        <div className="cote-message-avatar">
          {message.author?.avatarUrl ? (
            <img
              src={message.author.avatarUrl}
              alt={message.author.name}
              className="size-full object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-[12px] font-semibold text-muted-foreground">
              {(message.author.name || "?").charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {isAuthorOnline && (
          <span
            className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500"
            aria-label="Online"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <p className="cote-message-author truncate">{message.author.name}</p>
          {isOwnMessage && (
            <span className="rounded-full bg-primary/8 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-primary">
              You
            </span>
          )}
          <span className="cote-message-time shrink-0">{timeLabel}</span>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={isUpdatePending}
              className="min-h-24 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm leading-6 outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/10"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isUpdatePending}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-lg px-3"
                onClick={handleSave}
                disabled={isUpdatePending || !content.trim()}
              >
                {isUpdatePending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        ) : (
          <p
            className={
              "cote-message-copy" +
              (message.deletedAt ? " italic text-muted-foreground" : "")
            }
          >
            {message.deletedAt ? "Message deleted" : message.content}
          </p>
        )}
      </div>

      {isOwnMessage && !isEditing && !message.deletedAt && (
        <div className="cote-message-actions">
          <Popover open={isMoreActionsOpen} onOpenChange={setIsMoreActionsOpen}>
            <PopoverTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7 rounded-lg border border-border/80 bg-background/95 text-muted-foreground shadow-sm hover:text-foreground"
                  aria-label="Message actions"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <PopoverContent align="end" className="w-40 rounded-xl p-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 rounded-lg"
                onClick={handleEdit}
              >
                <Pencil className="size-3.5" />
                Edit message
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 rounded-lg text-destructive hover:text-destructive"
                onClick={handleDelete}
                disabled={isDeletePending}
              >
                {isDeletePending ? (
                  <Spinner className="size-3.5" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {isDeletePending ? "Deleting…" : "Delete message"}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </article>
  );
};