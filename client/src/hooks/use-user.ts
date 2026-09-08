import { getUser, logout } from "@/services/user.service.ts";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    retry: false,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    retry: false,
  });
};
