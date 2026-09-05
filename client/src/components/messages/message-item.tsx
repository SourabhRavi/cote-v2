import { MoreHorizontal, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDeleteMessage, useUpdateMessage } from "@/hooks/use-messages.ts";
import type { Message } from "@/types/message.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";

type MessageItemProps = {
  message: Message;
  onlineUsers: Set<string>;
};

export const MessageItem = ({ message, onlineUsers }: MessageItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(message.content ?? "");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateMessage, isPending: isUpdatePending } = useUpdateMessage();
  const { mutate: deleteMessage } = useDeleteMessage();

  // Check whether the message author's user ID is currently online.
  const isAuthorOnline = onlineUsers.has(message.author.id);

  const handleEdit = () => {
    setContent(message.content ?? "");
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteMessage({
      messageId: message.id,
    });
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
      {
        messageId: message.id,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      },
    );
  };

  // Set text cursor to the end of the message when editing starts.
  useEffect(() => {
    if (!isEditing || !textareaRef.current) return;

    textareaRef.current.focus();

    const cursorPosition = textareaRef.current.value.length;
    textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
  }, [isEditing]);

  return (
    <div className="group relative flex items-start gap-3 py-2.5">
      {/* Avatar + online status */}
      <div className="relative size-9 shrink-0">
        <div className="size-9 overflow-hidden rounded-[18px]">
          {message.author?.avatarUrl ? (
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

        {/* Show the green dot only when this author is online. */}
        {isAuthorOnline && (
          <span
            className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 ring-2 ring-background"
            aria-label="Online"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex w-full items-baseline justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-foreground">
                {message.author.name}
              </p>

              <span className="shrink-0 text-[11px] text-muted-foreground/60 uppercase">
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </div>
          </div>
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              disabled={isUpdatePending}
              className="min-h-20 resize-none"
            />

            <div className="flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isUpdatePending}>
                Cancel
              </Button>

              <Button size="sm" onClick={handleSave} disabled={isUpdatePending || !content.trim()}>
                {isUpdatePending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="min-w-0 text-sm leading-normal text-foreground wrap-break-word">
            {message.content}
          </p>
        )}

        {!isEditing && (
          <div className="absolute top-1 right-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="size-7">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Message actions</span>
                  </Button>
                }
              />

              <PopoverContent align="end" className="w-32 p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleEdit}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={handleDelete}
                >
                  <Pencil className="size-3.5" />
                  Delete
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Reactions will be added here later. */}
      </div>
    </div>
  );
};
