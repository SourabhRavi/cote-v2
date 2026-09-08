import { BrowserRouter, Route, Routes } from "react-router-dom";

import WorkspaceLayout from "@/layouts/WorkspaceLayout";
import LoginPage from "@/pages/LoginPage.tsx";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage.tsx";
import ChannelPage from "@/pages/ChannelPage.tsx";
import ProtectedRoute from "@/router/protected-route.tsx";
import WorkspacePage from "@/pages/WorkspacePage.tsx";
import PublicRoute from "@/router/public-route.tsx";
import AppLayout from "@/layouts/AppLayout.tsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            {/* Workspace not selected yet */}
            <Route path="/" element={<WorkspaceSelectionPage />} />

            {/* Workspace selected */}
            <Route element={<WorkspaceLayout />}>
              <Route path="/:workspaceId" element={<WorkspacePage />} />

              <Route path="/:workspaceId/:channelId" element={<ChannelPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
