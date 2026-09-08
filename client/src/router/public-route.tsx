import { useUser } from "@/hooks/use-user.ts";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { data: user } = useUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
