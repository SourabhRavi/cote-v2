import type { TypingUser } from "@/types/user.types.ts";

type MessageTypingIndicator = {
  users: TypingUser[];
};

const MessageTypingIndicator = ({ users }: MessageTypingIndicator) => {
  if (!users.length) return null;

  const names = users.map((user) => user.name.split(" ")[0]).join(", ");

  return (
    <p className="px-1 text-xs text-muted-foreground">
      {names} {users.length === 1 ? "is" : "are"} typing...
    </p>
  );
};

export default MessageTypingIndicator;
