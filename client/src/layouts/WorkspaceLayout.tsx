import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SOCKET_EVENTS } from "@/lib/socket-events.ts";
import { socket } from "@/lib/socket.ts";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const handleUserPresenceSnapshot = (userIds: string[]) => setOnlineUsers(userIds);

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers((previous) =>
        previous.includes(userId) ? previous : [...previous, userId],
      );
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((previous) => previous.filter((id) => id !== userId));
    };

    socket.on(SOCKET_EVENTS.USER_PRESENCE_SNAPSHOT, handleUserPresenceSnapshot);
    socket.on(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
    socket.on(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
    socket.connect();

    return () => {
      socket.off(SOCKET_EVENTS.USER_PRESENCE_SNAPSHOT, handleUserPresenceSnapshot);
      socket.off(SOCKET_EVENTS.USER_ONLINE, handleUserOnline);
      socket.off(SOCKET_EVENTS.USER_OFFLINE, handleUserOffline);
      socket.disconnect();
    };
  }, []);

  return (
    <SidebarProvider className="cote-app-shell">
      <AppSidebar />
      <SidebarInset className="cote-workspace-main min-h-0 overflow-hidden !p-0">
        <Outlet context={{ onlineUsers }} />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;