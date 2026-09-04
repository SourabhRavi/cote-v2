export const handleMessageKeyDown = (
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  onSend: () => void,
) => {
  if (e.key !== "Enter") return;

  if (e.shiftKey) {
    // Let textarea create a new line.
    return;
  }

  e.preventDefault();
  onSend();
};
