import { useUser } from "@/hooks/use-user.ts";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isPending, isError } = useUser();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
