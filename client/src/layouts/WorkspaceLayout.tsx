import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SOCKET_EVENTS } from "@/lib/socket-events.ts";
import { socket } from "@/lib/socket.ts";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const handleUserPresenceSnapshot = (userIds: string[]) => {
      setOnlineUsers(userIds);
    };

    const handleUserOnline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => (prev.includes(userId) ? prev : [...prev, userId]));
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
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
    <SidebarProvider className="h-svh min-h-0">
      <AppSidebar />

      <SidebarInset className="min-h-0 overflow-hidden">
        <Outlet context={{ onlineUsers }} />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default WorkspaceLayout;
