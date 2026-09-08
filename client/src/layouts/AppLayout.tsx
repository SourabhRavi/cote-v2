import { ThemeProvider } from "@/components/common/theme-provider.tsx";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <Outlet />
    </ThemeProvider>
  );
};

export default AppLayout;
