import type { TypingUser } from "@/types/user.types.ts";

type MessageTypingIndicatorProps = {
  users: TypingUser[];
};

const MessageTypingIndicator = ({ users }: MessageTypingIndicatorProps) => {
  if (!users.length) return null;

  const names = users.map((user) => user.name.split(" ")[0]).join(", ");

  return (
    <div className="cote-typing-indicator" aria-live="polite">
      <span className="cote-typing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>{names} {users.length === 1 ? "is" : "are"} typing</span>
    </div>
  );
};

export default MessageTypingIndicator;