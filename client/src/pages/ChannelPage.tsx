import { ChannelContent } from "@/components/channels/channel-content.tsx";
import { useOutletContext, useParams } from "react-router-dom";

const ChannelPage = () => {
  const { channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  const { onlineUsers } = useOutletContext<{
    onlineUsers: string[];
  }>();

  if (!channelId) {
    return null;
  }

  return <ChannelContent channelId={channelId} onlineUsers={onlineUsers} />;
};

export default ChannelPage;
