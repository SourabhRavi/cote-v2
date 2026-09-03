import { api } from "@/lib/axios.ts";

export const getWorkspaces = async () => {
  const response = await api.get("/workspaces");

  return response.data.data;
};
