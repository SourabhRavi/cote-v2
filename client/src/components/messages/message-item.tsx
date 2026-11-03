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
  const isAuthorOnline = onlineUsers ? onlineUsers.includes(message.author.id) : false;

  const handleEdit = () => {
    setContent(message.content ?? "");
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteMessage({ messageId: message.id }, { onSuccess: () => setIsMoreActionsOpen(false) });
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

  return (
    <article className="cote-message-row group">
      <div className="relative size-10 shrink-0">
        <div className="size-10 overflow-hidden rounded-xl border border-border/70 bg-muted">
          {message.author?.avatarUrl ? (
            <img src={message.author.avatarUrl} alt={message.author.name} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-[12px] font-semibold text-muted-foreground">
              {message.author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        {isAuthorOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-background bg-emerald-500" aria-label="Online" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-foreground">
            {message.author.name}
          </p>
          <span className="shrink-0 text-[10px] font-medium tabular-nums text-muted-foreground/75">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={isUpdatePending}
              className="min-h-24 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm leading-6 outline-none focus:border-ring focus:ring-3 focus:ring-ring/10"
            />
            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isUpdatePending}>Cancel</Button>
              <Button size="sm" className="rounded-lg px-3" onClick={handleSave} disabled={isUpdatePending || !content.trim()}>
                {isUpdatePending ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </div>
        ) : (
          <p className={\`min-w-0 whitespace-pre-wrap break-words text-[13px] leading-[1.75] text-foreground/90 \${message.deletedAt ? "italic text-muted-foreground" : ""}\`}>
            {message.deletedAt ? "Message deleted" : message.content}
          </p>
        )}
      </div>

      {!isEditing && !message.deletedAt && message.author.id === user.id && (
        <div className="absolute right-2 top-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <Popover open={isMoreActionsOpen} onOpenChange={setIsMoreActionsOpen}>
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="size-7 rounded-lg bg-background/90 text-muted-foreground shadow-sm ring-1 ring-border/70 hover:text-foreground">
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Message actions</span>
                </Button>
              }
            />
            <PopoverContent align="end" className="w-36 rounded-xl p-1.5">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-lg" onClick={handleEdit}>
                <Pencil className="size-3.5" /> Edit message
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 rounded-lg text-destructive hover:text-destructive" onClick={handleDelete}>
                {isDeletePending ? <Spinner className="size-3.5" /> : <Trash2 className="size-3.5" />}
                {isDeletePending ? "Deleting…" : "Delete message"}
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </article>
  );
};