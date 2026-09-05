import MessageTypingIndicator from "@/components/messages/message-typing-indicator.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useSendMessage } from "@/hooks/use-messages.ts";
import { handleMessageKeyDown } from "@/lib/message-utils.ts";
import { SOCKET_EVENTS } from "@/lib/socket-events.ts";
import { socket } from "@/lib/socket.ts";
import type { Channel } from "@/types/channel.types.ts";
import type { TypingUser } from "@/types/user.types.ts";
import { debounce } from "@/utils/debouce.ts";
import { AtSign, Paperclip, SmilePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MessageComposer = ({ channel }: { channel: Channel }) => {
  const { mutate, isPending } = useSendMessage();
  const [message, setMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const handleMessageSend = () => {
    const content = message.trim();
    setMessage("");

    if (!content) return;

    mutate({
      channelId: channel.id,
      content,
    });
  };

  const stopTyping = useRef(
    debounce(() => {
      socket.emit(SOCKET_EVENTS.TYPING_STOP, channel.id);
    }, 500),
  ).current;

  const handleMessageTyping = () => {
    socket.emit(SOCKET_EVENTS.TYPING_START, channel.id);
    stopTyping();
  };

  // handle show/hide typing indicator
  useEffect(() => {
    const handleTypingStart = (user: TypingUser) => {
      setTypingUsers((users) => {
        if (users.some((typingUser) => typingUser.id === user.id)) {
          return users;
        }

        return [...users, user];
      });
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
      <div className="shrink-0">
        <MessageTypingIndicator users={typingUsers} />
        <div className="mx-auto w-full rounded-xl bg-background shadow-lg shadow-primary/15 p-3">
          <textarea
            rows={2}
            placeholder={`Type message in #${channel.name}...`}
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
            value={message}
            onChange={(e) => {
              setMessage(() => e.target.value);
              handleMessageTyping();
            }}
            onKeyDown={(e) => handleMessageKeyDown(e, handleMessageSend)}
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

            <Button
              onClick={handleMessageSend}
              variant="default"
              className="w-20 rounded-md"
              disabled={!message.length || isPending}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessageComposer;
