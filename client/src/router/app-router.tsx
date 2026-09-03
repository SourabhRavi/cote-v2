import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import WorkspaceSelectionPage from "@/pages/WorkspaceSelectionPage.tsx";
import WorkspacePage from "@/pages/WorkspacePage.tsx";
import ChannelPage from "@/pages/ChannelPage.tsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Workspace not selected yet */}
        <Route path="/" element={<WorkspaceSelectionPage />} />

        {/* Workspace selected */}
        <Route element={<AppLayout />}>
          <Route path="/:workspaceId" element={<WorkspacePage />} />

          <Route path="/:workspaceId/:channelId" element={<ChannelPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
