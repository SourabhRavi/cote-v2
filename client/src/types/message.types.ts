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
};

export type MessageResponse = {
  messages: Message[];
  hasMore: boolean;
  nextCursor: string | null;
};
