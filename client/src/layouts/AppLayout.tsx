import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AppLayout = () => {
  return (
    <SidebarProvider className="h-svh min-h-0">
      <AppSidebar />

      <SidebarInset className="min-h-0 overflow-hidden">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AppLayout;
