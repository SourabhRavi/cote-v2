import { Button } from "@/components/ui/button.tsx";
import { useSendMessage } from "@/hooks/use-messages.ts";
import { handleMessageKeyDown } from "@/lib/message-utils.ts";
import type { Channel } from "@/types/channel.types.ts";
import { AtSign, Paperclip, SmilePlus } from "lucide-react";
import { useState } from "react";

const MessageComposer = ({ channel }: { channel: Channel }) => {
  const { mutate, isPending } = useSendMessage();
  const [message, setMessage] = useState("");

  const handleMessageSend = () => {
    const content = message.trim();
    setMessage("");

    if (!content) return;

    mutate({
      channelId: channel.id,
      content,
    });
  };

  return (
    <>
      <div className="shrink-0">
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
