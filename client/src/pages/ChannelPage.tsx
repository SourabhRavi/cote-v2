import { ChannelContent } from "@/components/channels/channel-content.tsx";
import { useParams } from "react-router-dom";

const ChannelPage = () => {
  const { channelId } = useParams<{
    workspaceId: string;
    channelId: string;
  }>();

  if (!channelId) {
    return null;
  }

  return <ChannelContent channelId={channelId} />;
};

export default ChannelPage;
