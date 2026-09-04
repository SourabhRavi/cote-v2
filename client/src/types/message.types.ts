export type Message = {
  id: string;
  content: string | null;
  createdAt: string;
  channelId: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  clientMessageId?: string;
};
