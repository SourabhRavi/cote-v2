import { AuthLoading } from "@/components/auth/auth-loading.tsx";
import { useUser } from "@/hooks/use-user.ts";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: user, isPending, isError } = useUser();

  if (isPending) {
    return <AuthLoading />;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
