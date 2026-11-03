import MessageTypingIndicator from "@/components/messages/message-typing-indicator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useSendMessage } from "@/hooks/use-messages.ts";
import { handleMessageKeyDown } from "@/lib/message-utils.ts";
import { SOCKET_EVENTS } from "@/lib/socket-events.ts";
import { socket } from "@/lib/socket.ts";
import type { Channel } from "@/types/channel.types.ts";
import type { TypingUser } from "@/types/user.types.ts";
import { debounce } from "@/utils/debouce.ts";
import { ArrowUp, CornerDownLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MessageComposer = ({ channel }: { channel: Channel }) => {
  const { mutate, isPending } = useSendMessage();
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const channelIdRef = useRef(channel.id);
  const stopTypingRef = useRef<(() => void) | null>(null);

  channelIdRef.current = channel.id;

  if (!stopTypingRef.current) {
    stopTypingRef.current = debounce(
      () => socket.emit(SOCKET_EVENTS.TYPING_STOP, channelIdRef.current),
      650,
    );
  }

  const handleMessageSend = () => {
    const content = message.trim();
    if (!content || isPending) return;

    stopTypingRef.current?.();
    socket.emit(SOCKET_EVENTS.TYPING_STOP, channel.id);
    setMessage("");
    mutate({ channelId: channel.id, content });
  };

  const handleMessageTyping = (value: string) => {
    if (!value.trim()) {
      stopTypingRef.current?.();
      socket.emit(SOCKET_EVENTS.TYPING_STOP, channel.id);
      return;
    }

    socket.emit(SOCKET_EVENTS.TYPING_START, channel.id);
    stopTypingRef.current?.();
  };

  useEffect(() => {
    const handleTypingStart = (user: TypingUser) => {
      setTypingUsers((users) =>
        users.some((typingUser) => typingUser.id === user.id)
          ? users
          : [...users, user],
      );
    };

    const handleTypingStop = (user: TypingUser) => {
      setTypingUsers((users) => users.filter((typingUser) => typingUser.id !== user.id));
    };

    socket.on(SOCKET_EVENTS.TYPING_START, handleTypingStart);
    socket.on(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);

    return () => {
      socket.off(SOCKET_EVENTS.TYPING_START, handleTypingStart);
      socket.off(SOCKET_EVENTS.TYPING_STOP, handleTypingStop);
      socket.emit(SOCKET_EVENTS.TYPING_STOP, channelIdRef.current);
    };
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + "px";
  }, [message]);

  return (
    <div className="cote-composer-wrap">
      <MessageTypingIndicator users={typingUsers} />
      <div className="cote-composer">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.13em] text-muted-foreground/80">
            Message #{channel.name}
          </span>
          <span className="hidden shrink-0 items-center gap-1 text-[10px] text-muted-foreground/65 sm:flex">
            <CornerDownLeft className="size-3" />
            Enter to send
          </span>
        </div>
        <textarea
          ref={textareaRef}
          rows={2}
          placeholder="Write a message…"
          className="cote-composer-input"
          value={message}
          aria-label="Write a message"
          onChange={(event) => {
            setMessage(event.target.value);
            handleMessageTyping(event.target.value);
          }}
          onKeyDown={(event) => handleMessageKeyDown(event, handleMessageSend)}
        />
        <div className="cote-composer-meta">
          <span className="hidden sm:inline">Shift + Enter for a new line</span>
          <span className="sm:hidden">Be thoughtful. Be clear.</span>
          <Button
            onClick={handleMessageSend}
            className="h-9 gap-2 rounded-xl px-3.5 shadow-sm"
            disabled={!message.trim().length || isPending}
          >
            {isPending ? "Sending…" : "Send"}
            <ArrowUp className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageComposer;