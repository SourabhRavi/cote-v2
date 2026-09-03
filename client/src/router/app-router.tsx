import { BrowserRouter, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import DashboardPage from "@/pages/DashboardPage.tsx";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
