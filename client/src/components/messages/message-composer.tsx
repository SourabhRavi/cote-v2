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

  const handleMessageSend = () => {
    const content = message.trim();
    if (!content) return;
    setMessage("");
    mutate({ channelId: channel.id, content });
  };

  const stopTyping = useRef(
    debounce(() => socket.emit(SOCKET_EVENTS.TYPING_STOP, channel.id), 500),
  ).current;

  const handleMessageTyping = () => {
    socket.emit(SOCKET_EVENTS.TYPING_START, channel.id);
    stopTyping();
  };

  useEffect(() => {
    const handleTypingStart = (user: TypingUser) => {
      setTypingUsers((users) =>
        users.some((typingUser) => typingUser.id === user.id) ? users : [...users, user],
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
    };
  }, []);

  return (
    <>
      <div className="cote-composer-wrap">
        <MessageTypingIndicator users={typingUsers} />
        <div className="cote-composer">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
              Message #{channel.name}
            </span>
            <span className="hidden items-center gap-1 text-[10px] text-muted-foreground/65 sm:flex">
              <CornerDownLeft className="size-3" /> Enter to send
            </span>
          </div>
          <textarea
            rows={2}
            placeholder="Write a message…"
            className="cote-composer-input"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              handleMessageTyping();
            }}
            onKeyDown={(event) => handleMessageKeyDown(event, handleMessageSend)}
          />
          <div className="flex items-center justify-between border-t border-border/70 pt-2.5">
            <span className="text-[10px] text-muted-foreground/65">Keep it thoughtful. Keep it moving.</span>
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
    </>
  );
};

export default MessageComposer;